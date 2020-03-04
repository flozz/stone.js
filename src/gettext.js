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

function gettext(string, replacements, local_parameter) {
    var result = string;
    if (typeof replacements === 'string') {
        local_parameter = replacements;
        replacements = undefined;
    }
    var locale = local_parameter || locale_default;

    if (locale && catalogs[locale] && catalogs[locale].messages &&
        catalogs[locale].messages[string] && catalogs[locale].messages[string].length > 0 &&
        catalogs[locale].messages[string][0] !== "") {
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
    clearCatalogs: clearCatalogs,
    addCatalogs: addCatalogs,
    listCatalogs: listCatalogs,
    getLocale: getLocale,
    setLocale: setLocale,
    setBestMatchingLocale: setBestMatchingLocale
};
