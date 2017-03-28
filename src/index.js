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
    clearCatalogs: gettext.clearCatalogs,
    addCatalogs: gettext.addCatalogs,
    getLocale: gettext.getLocale,
    setLocale: setLocale,
    setBestMatchingLocale: gettext.setBestMatchingLocale,
    findBestMatchingLocale: helpers.findBestMatchingLocale,
    guessUserLanguage: guessUserLanguage,
    enableDomScan: dom.enableDomScan,
    updateDomTranslation: dom.updateDomTranslation
};
