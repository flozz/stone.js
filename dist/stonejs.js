(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Stone = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

var _gettext = require("./gettext.js").gettext;

var domScan = false;

function updateDomTranslation() {
    if (!domScan) {
        return;
    }
    var elements = document.getElementsByTagName("*");
    var params = null;
    var attrs = null;
    var i = 0;
    var j = 0;
    for (i = 0 ; i < elements.length ; i++) {
        if (elements[i].hasAttribute("stonejs")) {
            // First pass
            if (!elements[i].hasAttribute("stonejs-orig-string")) {
                elements[i].setAttribute("stonejs-orig-string", elements[i].innerHTML);
            }

            params = {};
            attrs = elements[i].attributes;
            for (j = 0 ; j < attrs.length ; j++) {
                if (attrs[j].name.indexOf("stonejs-param-") === 0) {
                    params[attrs[j].name.substr(14)] = attrs[j].value;
                }
            }

            elements[i].innerHTML = _gettext(elements[i].getAttribute("stonejs-orig-string"), params);
        }
    }
}

function enableDomScan(enable) {
    domScan = Boolean(enable);
    updateDomTranslation();
}

module.exports = {
    enableDomScan: enableDomScan,
    updateDomTranslation: updateDomTranslation
};

},{"./gettext.js":2}],2:[function(require,module,exports){
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
        if (Array.isArray(messages) && messages.length > 0 && messages[0] !== "") {
            result = messages[0];
        } else if (Array.isArray(messages["*"]) && messages["*"].length > 0 && messages["*"][0] !== "") {
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
    if (pluralForms !== undefined && messages !== undefined) {
        if (!pluralFormsFunctions[locale]) {
            pluralFormsFunctions[locale] = helpers.generatePluralFormsFunction(pluralForms);
        }

        var pluralIndex = pluralFormsFunctions[locale](number);
        var message;
        if (Array.isArray(messages) && messages.length > 0) {
            message = messages;
        } else if (Array.isArray(messages["*"]) && messages["*"].length > 0) {
            message = messages["*"];
        }
        if (message[pluralIndex] !== undefined && message[pluralIndex] !== "") {
            result = message[pluralIndex];
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
        if (Array.isArray(messages[context]) && messages[context].length > 0 && messages[context][0] !== "") {
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
        if (Array.isArray(messages[context]) && messages[context].length > 0) {
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

},{"./helpers.js":3}],3:[function(require,module,exports){
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

function sendEvent(name, data) {
    data = data || {};
    var ev = null;
    try {
        ev = new Event(name);
    } catch (e) {
        // The old-fashioned way... THANK YOU MSIE!
        ev = document.createEvent("Event");
        ev.initEvent(name, true, false);
    }
    for (var i in data) {
        ev[i] = data[i];
    }
    document.dispatchEvent(ev);
}

// fr -> {lang: "fr", lect: null, q: 1}
// fr_FR, fr-fr -> {lang: "fr", lect: "fr", q: 1}
// fr_FR;q=0.8, fr-fr;q=0.8 -> {lang: "fr", lect: "fr", q: 0.8}
function parseLanguageCode(lang) {
    lang = lang.toLowerCase().replace(/-/g, "_");
    var result = {lang: null, lect: null, q: 1};
    var buff = "";

    if (lang.indexOf(";") > -1) {
        buff = lang.split(";");
        if (buff.length == 2 && buff[1].match(/^q=(1|0\.[0-9]+)$/)) {
            result.q = parseFloat(buff[1].split("=")[1]);
        }
        buff = buff[0] || "";
    } else {
        buff = lang;
    }

    if (buff.indexOf("_") > -1) {
        buff = buff.split("_");
        if (buff.length == 2) {
            if (buff[0].length == 2) {
                result.lang = buff[0];
                if (buff[1].length == 2) {
                    result.lect = buff[1];
                }
            }
        } else if (buff[0].length == 2) {
            result = buff[0];
        }
    } else if (buff.length == 2) {
        result.lang = buff;
    }

    return result;
}

function extractLanguages(languageString) {
    if (languageString === undefined) {
        languageString = navigator.language || navigator.userLanguage ||
            navigator.systemLanguage || navigator.browserLanguage;
    }
    if (!languageString || languageString === "") {
        return ["en"];
    }

    var langs = [];
    var rawLangs = languageString.split(",");
    var buff;

    // extract langs
    var lang;
    for (var i = 0 ; i < rawLangs.length ; i++) {
        lang = parseLanguageCode(rawLangs[i]);
        if (lang.lang) {
            langs.push(lang);
        }
    }

    // Empty list
    if (langs.length === 0) {
        return ["en"];
    }

    // Sort languages by priority
    langs = langs.sort(function (a, b) {
        return b.q - a.q;
    });

    // Generates final list
    var result = [];

    for (i = 0 ; i < langs.length ; i++) {
        buff = langs[i].lang;
        if (langs[i].lect) {
            buff += "_";
            buff += langs[i].lect.toUpperCase();
        }
        result.push(buff);
    }

    return result;
}

function findBestMatchingLocale(locale, catalogs) {
    if (!Array.isArray(locale)) {
        locale = [locale];
    }

    var buff;

    var refCatalogs = [];
    for (var i = 0 ; i < catalogs.length ; i++) {
        buff = parseLanguageCode(catalogs[i]);
        buff.cat = catalogs[i];
        refCatalogs.push(buff);
    }

    var locales = [];
    for (i = 0 ; i < locale.length ; i++) {
        locales.push(parseLanguageCode(locale[i]));
    }

    function _match(lang, lect, catalogList) {
        if (lang === null) {
            return null;
        }
        for (var i = 0 ; i < catalogList.length ; i++) {
            if (lect == "*" && catalogList[i].lang === lang) {
                return catalogList[i];
            } else if (catalogList[i].lang === lang && catalogList[i].lect === lect) {
                return catalogList[i];
            }
        }
    }

    // 1. Exact matching (with locale+lect > locale)
    var bestMatchingLocale = null;
    var indexMatch = 0;
    for (i = 0 ; i < locales.length ; i++) {
        buff = _match(locales[i].lang, locales[i].lect, refCatalogs);
        if (buff && (!bestMatchingLocale)) {
            bestMatchingLocale = buff;
            indexMatch = i;
        } else if (buff && bestMatchingLocale &&
                   buff.lang === bestMatchingLocale.lang &&
                   bestMatchingLocale.lect === null && buff.lect !== null) {
            bestMatchingLocale = buff;
            indexMatch = i;
        }
        if (bestMatchingLocale && bestMatchingLocale.lang && bestMatchingLocale.lect) {
            break;
        }
    }

    // 2. Fuzzy matching of locales without lect (fr_FR == fr)
    for (i = 0 ; i < locales.length ; i++) {
        buff = _match(locales[i].lang, null, refCatalogs);
        if (buff) {
            if ((!bestMatchingLocale) || bestMatchingLocale && indexMatch >= i &&
                bestMatchingLocale.lang !== buff.lang) {
                return buff.cat;
            }
        }
    }

    // 3. Fuzzy matching with ref lect (fr_* == fr_FR)
    for (i = 0 ; i < locales.length ; i++) {
        buff = _match(locales[i].lang, locales[i].lang, refCatalogs);
        if (buff) {
            if ((!bestMatchingLocale) || bestMatchingLocale && indexMatch >= i &&
                bestMatchingLocale.lang !== buff.lang) {
                return buff.cat;
            }
        }
    }

    // 1.5 => set the language found at step 1 if there is nothing better
    if (bestMatchingLocale) {
        return bestMatchingLocale.cat;
    }

    // 4. Fuzzy matching of any lect (fr_* == fr_*)
    for (i = 0 ; i < locales.length ; i++) {
        buff = _match(locales[i].lang, "*", refCatalogs);
        if (buff) {
            return buff.cat;
        }
    }

    // 5. Nothing matches... maybe the given locales are invalide... try to match with catalogs
    for (i = 0 ; i < locale.length ; i++) {
        if (catalogs.indexOf(locale[i]) >= 0) {
            return locale[i];
        }
    }

    // 6. Nothing matches... lang = c;
    return "c";
}

function extractPluralExpression(pluralForms) {
    var REGEX = /^\s*nplurals=\s*(\d+)\s*;\s*plural=([()n\s<>=\d&|%?!:+\-*\/]+);?[\s\\n]*$/g;
    var result = REGEX.exec(pluralForms);
    if (!result) {
        throw new Error("plural forms are not valid");
    }
    return result[2];
}

function generatePluralFormsFunction(pluralForms) {
    var pluralExpression = extractPluralExpression(pluralForms);
    /* jshint -W061 */
    var pluralFormsFunction = Function("n", "return " + pluralExpression);
    /* jshint +W061 */
    return function (n) {
        return Number(pluralFormsFunction(n));
    };
}

module.exports = {
    sendEvent: sendEvent,
    parseLanguageCode: parseLanguageCode,
    extractLanguages: extractLanguages,
    findBestMatchingLocale: findBestMatchingLocale,
    generatePluralFormsFunction: generatePluralFormsFunction,
    extractPluralExpression: extractPluralExpression,
};

},{}],4:[function(require,module,exports){
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
var gettext = require("./gettext.js");
var dom = require("./dom.js");

function guessUserLanguage() {
    return helpers.extractLanguages()[0];
}

function setLocale(l) {
    gettext.setLocale(l);
    dom.updateDomTranslation();
    helpers.sendEvent("stonejs-locale-changed");
}

function _autoloadCatalogs(event) {
    gettext.addCatalogs(event.catalog);
}

document.addEventListener("stonejs-autoload-catalogs", _autoloadCatalogs, true);

module.exports = {
    LazyString: gettext.LazyString,
    gettext: gettext.gettext,
    lazyGettext: gettext.lazyGettext,

    LazyNString: gettext.LazyNString,
    ngettext: gettext.ngettext,
    lazyNgettext: gettext.lazyNgettext,

    LazyPString: gettext.LazyPString,
    pgettext: gettext.pgettext,
    lazyPgettext: gettext.lazyPgettext,

    LazyNPString: gettext.LazyNPString,
    npgettext: gettext.npgettext,
    lazyNpgettext: gettext.lazyNpgettext,

    gettext_noop: gettext.gettext_noop,
    clearCatalogs: gettext.clearCatalogs,
    addCatalogs: gettext.addCatalogs,
    getLocale: gettext.getLocale,
    setLocale: setLocale,
    listCatalogs: gettext.listCatalogs,
    setBestMatchingLocale: gettext.setBestMatchingLocale,
    findBestMatchingLocale: helpers.findBestMatchingLocale,
    guessUserLanguage: guessUserLanguage,
    enableDomScan: dom.enableDomScan,
    updateDomTranslation: dom.updateDomTranslation
};

},{"./dom.js":1,"./gettext.js":2,"./helpers.js":3}]},{},[4])(4)
});
