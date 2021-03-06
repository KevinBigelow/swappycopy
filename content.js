debugger;

chrome.runtime.onMessage.addListener(extensionOpened);

/* ---------------------
    Content Objects
----------------------- */

var companies = {
    1: 'Acme Corporation',
    2: 'Globex Corporation',
    3: 'Soylent Corp',
    4: 'Initech',
    5: 'Bluth Company',
    6: 'Umbrella Corporation',
    7: 'Hooli',
    8: 'Vehement Capital Partners',
    9: 'Massive Dynamic',
    10: 'Wonka Industries',
    11: 'Stark Industries',
    12: 'Gekko & Co',
    13: 'Wayne Enterprises',
    14: 'Bubba Gump',
    15: 'Cyberdyne Systems',
    16: 'Genco Pura Olive Oil Company',
    17: 'The New York Inquirer',
    18: 'Duff Beer',
    19: 'Olivia Pope & Associates',
    20: 'Sterling Cooper',
    21: 'Ollivanders Wand Shop',
    22: 'Cheers',
    23: 'Krusty Krab',
    24: 'Good Burger'
};

var names = {
    1: 'Bradley Mueller',
    2: 'Clara Heath',
    3: 'Davis Logan',
    4: 'Yosef Chase',
    5: 'Cristofer Dunlap',
    6: 'Madelynn Foley',
    7: 'Rodolfo Scott',
    8: 'Adelyn Fletcher',
    9: 'Donovan Duffy',
    10: 'Jarrett Kelley',
    11: 'Nelson Brock',
    12: 'Jaime Knight',
    13: 'Moses Wolfe',
    14: 'Alan Morgan',
    15: 'Ronin Holder',
    16: 'Kamora Rios',
    17: 'Jaidyn Walls',
    18: 'Madelyn Collier',
    19: 'Grayson Stanton',
    20: 'Kennedy Green',
    21: 'Josephine Rojas',
    22: 'Alexis Hicks',
    23: 'Andrea Church',
    24: 'Gloria Cameron',
    25: 'Noelle Carson',
    26: 'Jamar Griffith',
    27: 'Marshall Ray',
    28: 'Xander Conrad',
    29: 'Dante Burke',
    30: 'Tristian Hartman'
};



/* -----------------------------------------------------------------------------
    SC Functions
----------------------------------------------------------------------------- */

function extensionOpened(message, sender, sendResponse) {

    $('body').append(message.div);
    $('.swappycopy__popup').load(chrome.runtime.getURL(message.popup));
    insertPopupCss(chrome.runtime.getURL(message.stylesheet));
    elementSelector();
}

function insertPopupCss(filename) {
    let link = $('<link />', {
        rel: "stylesheet",
        type: "text/css",
        href: filename
    })
    $('head').append(link);
}



/* -----------------------------------------------------------------------------
    Form Submission
----------------------------------------------------------------------------- */

$(document).on('click', '.sc-js__submit', function() {
    $('.sc-js__swap-form').submit();
});

$(document).on('submit', '.sc-js__swap-form', function(e) {
    e.preventDefault();

    var formData = {
        'targetElement': $('.sw-js__target-element').val(),
        'contentType': $('.content-type').val(),
        'customContent': $('.custom-content').val(),
        'numberMin': $('.number-min').val(),
        'numberMax': $('.number-max').val(),
        'numberPrefix': $('.number-prefix').val(),
        'numberSuffix': $('.number-suffix').val(),
        'numberDecimals': $('.number-decimals').val(),
        'numberThousandsSeparator': $('.number-thousands-separator').prop('checked')
    };

    /* FIXME: Ensure Swappy Copy elements are secure from being swapped */
    var targetElement = formData.targetElement;
    var contentType = formData.contentType;

    if (contentType == 'custom') {
        $(targetElement).text(formData.customContent);

    } else if (contentType == 'numbers') {
        var numberMin = formData.numberMin
        var numberMax = formData.numberMax;

        $(targetElement).each(function(){
            var randomNumber = Math.random() * (numberMax - numberMin) + parseFloat(numberMin);

            // Round randomNumber to the specified decimal
            randomNumber = Number.parseFloat(randomNumber).toFixed(formData.numberDecimals);

            // Add thousands separator (comma) to randomNumber
            if (formData.numberThousandsSeparator == true) {
                randomNumber = randomNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            // Print randomNumber with prefix and suffix
            $(this).text(formData.numberPrefix + randomNumber + formData.numberSuffix);
        });

    } else {
        var contentItems = window[contentType];
        var i = 1;

        $(targetElement).each(function(){
            $(this).text(contentItems[i]);

            if (i === Object.keys(contentItems).length) {
                i = 1;
            } else {
                i++;
            }
        });
    }
});



/* -----------------------------------------------------------------------------
    Form Field Interactivity
----------------------------------------------------------------------------- */

$(document).on('change', '.content-type', function() {

    if ($(this).val() == 'custom') {
        $('.custom-content-fields').fadeIn();
    } else {
        $('.custom-content-fields').fadeOut();
    }

    if ($(this).val() == 'numbers') {
        $('.number-fields').fadeIn();
    } else {
        $('.number-fields').fadeOut();
    }
});



/* -----------------------------------------------------------------------------
    Element Selection
----------------------------------------------------------------------------- */

function elementSelector() {

    $(document).click(function(e) {
        let eventTarget = e.target;
        let domElement = $(eventTarget)[0];
        let tagName = domElement.tagName.toLowerCase();
        let bannedTags = new Array('html', 'body', 'img', 'svg');

        /* FIXME: Set limits for number of descendants */
        if (!eventTarget.closest('.swappycopy__popup')) {

            if (tagName === 'a') {
                e.preventDefault();
            }

            if (bannedTags.indexOf(tagName) === -1) {
                resetElementBuilder();
                printTagName(domElement);
                printClasses(domElement);
                printId(domElement);
                printValue(domElement);
                printCopy(domElement);
            }
        }
    });
}

function resetElementBuilder() {

    const $targetElement = $('.sw-js__target-element');
    const selectorTypes = [
        '.sw-js__tag',
        '.sw-js__classes',
        '.sw-js__id',
        '.sw-js__value',
        '.sw-js__copy',
    ];

    $targetElement.val('');

    for (var i = 0; i <= selectorTypes.length; i++) {
        const selector = selectorTypes[i];

        $(selector).find('.sw__btn-group').empty();
    }
}

function printTagName(element) {
    const tagName = element.tagName.toLowerCase();

    $('.sw-js__element-builder .sw-js__tag .sw__btn-group').append('<a class="sw-js__add-selector" data-type="tag" data-value="' + tagName + '">' + tagName + '</a>');
    $('.sw-js__element-builder .sw-js__tag').fadeIn();
}

function printClasses(element) {
    const classes = element.classList;
    const classCount = classes.length;

    if (classCount != 0) {
        for (var i = 0; i < classCount; i++) {
            $('.sw-js__element-builder .sw-js__classes .sw__btn-group').append('<a class="sw-js__add-selector" data-type="class" data-value=".' + classes[i] + '">.' + classes[i] + '</a>');
        }
        $('.sw-js__element-builder .sw-js__classes').fadeIn();
    }
}

function printId(element) {
    const id = element.id;

    if (id != '') {
        $('.sw-js__element-builder .sw-js__id .sw__btn-group').append('<a class="sw-js__add-selector" data-type="id" data-value="#' + id + '">#' + id + '</a>');
        $('.sw-js__element-builder .sw-js__id').fadeIn();
    }
}

function printValue(element) {
    const value = $(element).val();
    
    if (value != '') {
        $('.sw-js__element-builder .sw-js__value .sw__btn-group').append('<a class="sw-js__add-selector" data-type="value" data-value="' + value + '">' + value + '</a>');
        $('.sw-js__element-builder .sw-js__value').fadeIn();
    }
}

function printCopy(element) {
    const copy = $(element).text();
    
/*
    if (copy.indexOf('\'') == -1) {
        const copyEscapedSingleQuotes = $(copy).replace(/\\([\s\S])|(')/g,"\\$1$2");
        console.log(copyEscapedSingleQuotes);
    }

    if (copy.indexOf('\"') == -1) {
        const copyEscapedDoubleQuotes = $(copy).replace(/\\([\s\S])|(")/g,"\\$1$2");
        console.log(copyEscapedDoubleQuotes);
    }
*/

    if (copy != '') {
        $('.sw-js__element-builder .sw-js__copy .sw__btn-group').append('<a class="sw-js__add-selector" data-type="copy" data-value="' + copy + '">' + copy + '</a>');
        $('.sw-js__element-builder .sw-js__copy').fadeIn();
    }
}



/* -----------------------------------------------------------------------------
    Append/Remove from target Field
----------------------------------------------------------------------------- */

function appendToTarget() {}
function removeFromTarget() {}

$(document).on('click', '.sw-js__add-selector', function() {

    const selector = $(this).data('value');
    const selectorType = $(this).data('type');
    const $targetElement = $('.sw-js__target-element');
    let targetElementValue = '';

    if (selectorType == 'tag') {
        targetElementValue = selector + $targetElement.val();

    } else if (selectorType == 'copy') {
        targetElementValue = $targetElement.val() + ':contains("' + selector + '")';
        $(this).addClass('sw-js__copy-in-selector');

    } else {
        if ($('.sw-js__copy-in-selector')) {
            targetElementValue = $targetElement.val() + selector;
        } else {
            targetElementValue = $targetElement.val() + selector;
        }
    }

    $targetElement.val(targetElementValue);

    $(this).removeClass('sw-js__add-selector');
    $(this).addClass('sw-js__remove-selector');
});
