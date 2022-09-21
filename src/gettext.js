/*
 * Copyright (c) 2014-2015, Fabien LOISON <http://flozz.fr>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of the author nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

var helpers = require("./helpers.js");

var catalogs = {};
var locale_default = null;
var pluralFormsFunctions = {};

function gettext(string, replacements, locale_parameter) {
    var result = string;
    if (typeof replacements == "string") {
        locale_parameter = replacements;
        replacements = undefined;
    }
    var locale = locale_parameter || locale_default;

    if (locale && catalogs[locale] && catalogs[locale].messages && catalogs[locale].messages[string]) {
        var messages = catalogs[locale].messages[string];
        if (messages instanceof Array && messages.length > 0 && messages[0] !== "") {
            result = messages[0];
        }
        if (messages["*"] && messages["*"][0] !== "") {
            result = messages["*"][0];
        }
    }

    if (replacements) {
        for (var r in replacements) {
            result = result.replace(new RegExp("\{" + r + "\}", "g"), replacements[r]);
        }
    }

    return result;
}

/**
 * Usage:
 * ```
 * ngettext("{n} file removed", "{n} files removed", n)
 * ngettext("{n} file removed", "{n} files removed", n, {n: n})
 * ngettext("{count} file removed", "{count} files removed", n, {count: n})
 * ```
 * @param {string} string
 * @param {string} stringPlural
 * @param {number} number
 * @param {Object} [replacements]
 * @param {string} [locale_parameter]
 */
function ngettext(string, stringPlural, number, replacements, locale_parameter) {
    var result = number === 1 ? string : stringPlural;
    if (typeof replacements == "string") {
        locale_parameter = replacements;
        replacements = undefined;
    }
    var locale = locale_parameter || locale_default;

    var messages;
    var pluralForms;
    if (locale && catalogs[locale] && catalogs[locale].messages) {
        pluralForms = catalogs[locale]["plural-forms"];
        messages = catalogs[locale].messages[string];
    }
    if (pluralForms && messages) {
        if (!pluralFormsFunctions[locale]) {
            pluralFormsFunctions[locale] = helpers.generatePluralFormsFunction(pluralForms);
        }
        if (messages instanceof Array && messages.length > 0) {
            var pluralIndex = pluralFormsFunctions[locale](number);
            if (messages[pluralIndex] && messages[pluralIndex] !== "") {
                result = messages[pluralIndex];
            }
        }
        if (messages["*"]) {
            var pluralIndex = pluralFormsFunctions[locale](number);
            if (messages["*"][pluralIndex] && messages["*"][pluralIndex] !== "") {
                result = messages["*"][pluralIndex];
            }
        }
    }

    if (!replacements) {
        replacements = {};
    }
    if (replacements.n === undefined) {
        replacements.n = number;
    }
    for (var r in replacements) {
        result = result.replace(new RegExp("\{" + r + "\}", "g"), replacements[r]);
    }

    return result;
}

function pgettext(context, string, replacements, locale_parameter) {
    var result = string;
    if (typeof replacements == "string") {
        locale_parameter = replacements;
        replacements = undefined;
    }
    var locale = locale_parameter || locale_default;

    if (locale && catalogs[locale] && catalogs[locale].messages && catalogs[locale].messages[string]) {
        var messages = catalogs[locale].messages[string];
        if (messages[context] && messages[context][0] !== "") {
            result = messages[context][0];
        }
    }

    if (replacements) {
        for (var r in replacements) {
            result = result.replace(new RegExp("\{" + r + "\}", "g"), replacements[r]);
        }
    }

    return result;
}

function npgettext(context, string, stringPlural, number, replacements, locale_parameter) {
    var result = number === 1 ? string : stringPlural;
    if (typeof replacements == "string") {
        locale_parameter = replacements;
        replacements = undefined;
    }
    var locale = locale_parameter || locale_default;

    var messages;
    var pluralForms;
    if (locale && catalogs[locale] && catalogs[locale].messages) {
        pluralForms = catalogs[locale]["plural-forms"];
        messages = catalogs[locale].messages[string];
    }
    if (pluralForms && messages) {
        if (!pluralFormsFunctions[locale]) {
            pluralFormsFunctions[locale] = helpers.generatePluralFormsFunction(pluralForms);
        }
        if (messages[context]) {
            var pluralIndex = pluralFormsFunctions[locale](number);
            if (messages[context][pluralIndex] && messages[context][pluralIndex] !== "") {
                result = messages[context][pluralIndex];
            }
        }
    }

    if (!replacements) {
        replacements = {};
    }
    if (replacements.n === undefined) {
        replacements.n = number;
    }
    for (var r in replacements) {
        result = result.replace(new RegExp("\{" + r + "\}", "g"), replacements[r]);
    }

    return result;
}

function _copyStringPrototype(object) {
    var props = Object.getOwnPropertyNames(String.prototype);
    for (var i = 0 ; i < props.length ; i++) {
        if (props[i] == "toString") {
            continue;
        }
        if (typeof(String.prototype[props[i]]) == "function") {
            object[props[i]] = function () {
                var translatedString = this.self.toString();
                return translatedString[this.prop].apply(translatedString, arguments);
            }.bind({self: object, prop: props[i]});
        } else {
            Object.defineProperty(object, props[i], {
                get: function () {
                    var translatedString = this.self.toString();
                    return translatedString[this.prop];
                }.bind({self: object, prop: props[i]}),
                enumerable: false,
                configurable: false
            });
        }
    }
}

function LazyString(string, replacements, locale) {
    this.toString = gettext.bind(this, string, replacements, locale);
    _copyStringPrototype(this);
}

function lazyGettext(string, replacements, locale) {
    return new LazyString(string, replacements, locale);
}

function LazyNString(string, stringPlural, number, replacements, locale) {
    this.toString = ngettext.bind(this, string, stringPlural, number, replacements, locale);
    _copyStringPrototype(this);
}

function lazyNgettext(string, stringPlural, number, replacements, locale) {
    return new LazyNString(string, stringPlural, number, replacements, locale);
}

function LazyPString(context, string, replacements, locale) {
    this.toString = pgettext.bind(this, context, string, replacements, locale);
    _copyStringPrototype(this);
}

function lazyPgettext(context, string, replacements, locale) {
    return new LazyPString(context, string, replacements, locale);
}

function LazyNPString(context, string, stringPlural, number, replacements, locale) {
    this.toString = npgettext.bind(this, context, string, stringPlural, number, replacements, locale);
    _copyStringPrototype(this);
}

function lazyNpgettext(context, string, stringPlural, number, replacements, locale) {
    return new LazyNPString(context, string, stringPlural, number, replacements, locale);
}

/**
 * Register a string to be translatable.
 * Do not operate translation.
 * Translation can be operated later with `gettext`
 *
 * Usage:
 * ```javascript
 * // Register the string for translation
 * var translatable = gettext_noop("Some string to translate later");
 * // Translate
 * var translated = gettext(translatable);
 * ```
 * @param {string} string string
 * @returns {string} the exact same given string
 */
function gettext_noop(string) {
    return string;
}

function clearCatalogs() {
    for (var locale in catalogs) {
        delete catalogs[locale];
    }
}

function listCatalogs() {
    return Object.keys(catalogs);
}

function addCatalogs(newCatalogs) {
    for (var locale in newCatalogs) {
        if (catalogs[locale]) {
            catalogs[locale]["plural-forms"] = newCatalogs[locale]["plural-forms"];
            for (var message in newCatalogs[locale].messages) {
                catalogs[locale].messages[message] = newCatalogs[locale].messages[message];
            }
        } else {
            catalogs[locale] = newCatalogs[locale];
        }
    }
}

function getLocale() {
    return locale_default;
}

function setLocale(l) {
    locale_default = l;
}

function setBestMatchingLocale(l) {
    if (!l) {
        l = helpers.extractLanguages();
    }
    var availableCatalogs = Object.keys(catalogs);

    var bestLocale = helpers.findBestMatchingLocale(l, availableCatalogs);
    setLocale(bestLocale);
}

module.exports = {
    catalogs: catalogs,
    LazyString: LazyString,
    gettext: gettext,
    lazyGettext: lazyGettext,
    LazyNString: LazyNString,
    ngettext: ngettext,
    lazyNgettext: lazyNgettext,
    LazyPString: LazyPString,
    pgettext: pgettext,
    lazyPgettext: lazyPgettext,
    LazyNPString: LazyNPString,
    npgettext: npgettext,
    lazyNpgettext: lazyNpgettext,
    gettext_noop: gettext_noop,
    clearCatalogs: clearCatalogs,
    addCatalogs: addCatalogs,
    listCatalogs: listCatalogs,
    getLocale: getLocale,
    setLocale: setLocale,
    setBestMatchingLocale: setBestMatchingLocale
};
