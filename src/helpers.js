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

function extractLanguages(languageString) {
    if (languageString === undefined) {
        languageString = navigator.language || navigator.userLanguage ||
            navigator.systemLanguage || navigator.browserLanguage;
    }
    if (!languageString || languageString === "") {
        return ["en"];
    }

    var langs = [];
    var rawLangs = languageString.toLowerCase()
                                 .replace(/-/g, "_")
                                 .split(",");
    var buff;

    // extract lang
    var lang;
    for (var i = 0 ; i < rawLangs.length ; i++) {
        lang = {lang: null, lect: null, q: 1};
        if (rawLangs[i].indexOf(";") > -1) {
            buff = rawLangs[i].split(";");
            if (buff.length == 2 && buff[1].match(/^q=(1|0\.[0-9]+)$/)) {
                lang.q = parseFloat(buff[1].split("=")[1]);
            }
            buff = buff[0] || "";
        } else {
            buff = rawLangs[i];
        }

        if (buff.indexOf("_") > -1) {
            buff = buff.split("_");
            if (buff.length == 2) {
                if (buff[0].length == 2) {
                    lang.lang = buff[0];
                    if (buff[1].length == 2) {
                        lang.lect = buff[1];
                    }
                }
            } else if (buff[0].length == 2) {
                lang = buff[0];
            }
        } else if (buff.length == 2) {
            lang.lang = buff;
        }

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

module.exports = {
    sendEvent: sendEvent,
    extractLanguages: extractLanguages
};
