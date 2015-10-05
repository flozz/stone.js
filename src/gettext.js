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
var locale = null;

function gettext(string, replacements) {
    var result = string;

    if (locale && catalogs[locale] && catalogs[locale].messages && catalogs[locale].messages[string] &&
        catalogs[locale].messages[string].length > 0 && catalogs[locale].messages[string][0] !== "") {
        result = catalogs[locale].messages[string][0];
    }

    if (replacements) {
        for (var r in replacements) {
            result = result.replace(new RegExp("\{" + r + "\}", "g"), replacements[r]);
        }
    }

    return result;
}

function LazyString(string, replacements) {
    this.toString = gettext.bind(this, string, replacements);

    var props = Object.getOwnPropertyNames(String.prototype);
    for (var i = 0 ; i < props.length ; i++) {
        if (props[i] == "toString") {
            continue;
        }
        if (typeof(String.prototype[props[i]]) == "function") {
            this[props[i]] = function () {
                var translatedString = this.self.toString();
                return translatedString[this.prop].apply(translatedString, arguments);
            }.bind({self: this, prop: props[i]});
        } else {
            Object.defineProperty(this, props[i], {
                get: function () {
                    var translatedString = this.self.toString();
                    return translatedString[this.prop];
                }.bind({self: this, prop: props[i]}),
                enumerable: false,
                configurable: false
            });
        }
    }
}

function lazyGettext(string, replacements) {
    return new LazyString(string, replacements);
}

function addCatalogs(newCatalogs) {
    for (var locale in newCatalogs) {
        catalogs[locale] = newCatalogs[locale];
    }
}

function getLocale() {
    return locale;
}

function setLocale(l) {
    locale = l;
}

function setBestMatchingLocale(l) {
    if (!l) {
        l = helpers.extractLanguages();
    }
    if (!Array.isArray(l)) {
        l = [l];
    }

    var buff;

    var availableCatalogs = Object.keys(catalogs);
    var refCatalogs = [];
    for (var i = 0 ; i < availableCatalogs.length ; i++) {
        buff = helpers.parseLanguageCode(availableCatalogs[i]);
        buff.cat = availableCatalogs[i];
        refCatalogs.push(buff);
    }

    var locales = [];
    for (i = 0 ; i < l.length ; i++) {
        locales.push(helpers.parseLanguageCode(l[i]));
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
                setLocale(buff.cat);
                return;
            }
        }
    }

    // 3. Fuzzy matching with ref lect (fr_* == fr_FR)
    for (i = 0 ; i < locales.length ; i++) {
        buff = _match(locales[i].lang, locales[i].lang, refCatalogs);
        if (buff) {
            if ((!bestMatchingLocale) || bestMatchingLocale && indexMatch >= i &&
                bestMatchingLocale.lang !== buff.lang) {
                setLocale(buff.cat);
                return;
            }
        }
    }

    // 1.5 => set the language found at step 1 if there is nothing better
    if (bestMatchingLocale) {
        setLocale(bestMatchingLocale.cat);
        return;
    }

    // 4. Fuzzy matching of any lect (fr_* == fr_*)
    for (i = 0 ; i < locales.length ; i++) {
        buff = _match(locales[i].lang, "*", refCatalogs);
        if (buff) {
            setLocale(buff.cat);
            return;
        }
    }

    // 5. Nothing matches... maybe the given locales are invalide... try to match with catalogs
    for (i = 0 ; i < l.length ; i++) {
        if (catalogs[l[i]]) {
            setLocale(l[i]);
            return;
        }
    }

    // 6. Nothing matches... lang = c;
    setLocale("c");
}

module.exports = {
    LazyString: LazyString,
    gettext: gettext,
    lazyGettext: lazyGettext,
    addCatalogs: addCatalogs,
    getLocale: getLocale,
    setLocale: setLocale,
    setBestMatchingLocale: setBestMatchingLocale
};
