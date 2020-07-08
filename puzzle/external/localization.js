var Localization = function() {};

// initializes the localization object by detecting the user's preferred language
Localization.prototype.init = function() {
    this._strings = [];
    this._language = null;

    if (navigator && navigator.userAgent && (this._language = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
        this._language = this._language[1];
    }

    if (!this._language && navigator) {
        if (navigator.languages) {
            this._language = navigator.languages[0];
        } else if (navigator.language) {
            this._language = navigator.language;
        } else if (navigator.browserLanguage) {
            this._language = navigator.browserLanguage;
        } else if (navigator.systemLanguage) {
            this._language = navigator.systemLanguage;
        } else if (navigator.userLanguage) {
            this._language = navigator.userLanguage;
        }

        if (this._language) {
            this._language = this._language.substr(0, 2);
        }
    }
    if (!this._language)
        this._language = 'he';

};

// register a string and its translations.  the translations structure
// should be an array of key=>value pairs where the key is the language
// code and the value is that language's translation of the string.
Localization.prototype.registerString = function(string, translations) {
    this._strings[string] = translations;
};


// register multiple strings and theirs translations.  the translations
// structure should be key=>value pairs where the keys are the strings
// in english, and the value for each is a structure of an array of
// key=>value pairs where the key is the language code and the value is
// that language's translation of the string.
Localization.prototype.registerStrings = function(translations) {
    for (var string in translations) {
        this.registerString(string, translations[string]);
    }
};


// returns the user's detected preferred language
Localization.prototype.getLanguage = function() {
    return this._language;
};


// gets the text string in the user's preferred language.  falls back
// to the provided string if no translation is found.
// macros may be passed (keys:values object) to substitute in for
// any %MACRO% style macros in the text.
Localization.prototype.get = function(string, macros) {
    var s = this._strings[string] && this._strings[string].en || string;
    if (this._strings[string] && this._strings[string][this._language])
        s = this._strings[string][this._language];

    // replace any macros, if present
    if (macros) {
        for (var macro in macros) {
            s = s.replace(macro, macros[macro]);
        }
    }

    return s;
};


// helper function for sizing a Phaser text object to fit within a width/height
// region by adjusting the font size downwards.
// you may pass width as null if the text field has wordWrap enabled, and it will
// use the wordWrapWidth.
Localization.prototype.fitText = function(field, width, height) {
    // So we don't lose the original value of the font size, create a property on the field to store it.
    if (!field.defaultFontSize) {
        field.defaultFontSize = field.fontSize.replace(/\D/g,'');
    }

    // Set the field's font size back to it's original value before setting the new text.
    field.fontSize = field.defaultFontSize + 'pt';

    // If word wrap is set, then use the word wrap width as the bounds' width instead.
    if (field.wordWrap) {
        width = field.wordWrapWidth;
    }

    // Check if bounds were provided.
    if (width > 0 && height > 0) {
        // Use the default font size as a base for the auto sizing.
        var size = field.defaultFontSize;

        // While the width or height is greater then the provided bounds, subtract one from the font size.
        while ((field.width > width || field.height > height) && size > 4) {
            size = size - 1;
            field.fontSize = size + 'pt';
        }
    }
};

var localization = new Localization();
localization.init();
