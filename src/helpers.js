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

function extractPluralForms(pluralForms) {
    if (!/^nplurals=[=\d]\s*;\s*plural=[()n\s<>=\d&|%?!:+\-*\/]+;?\s*$/g.test(pluralForms)) {
        throw new Error("plural forms are not valid");
    }
    return pluralForms.split(";")[1].replace("plural=", "");
}

function generatePluralFormsFunction(pluralForms) {
    var pluralExpression = extractPluralForms(pluralForms);
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
    extractPluralForms: extractPluralForms,
};
