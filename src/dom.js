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

function enableDomScan(enable) {
    domScan = !!enable;
    updateDomTranslation();
}

function updateDomTranslation() {
    if (!domScan) {
        return;
    }
    var elements = document.getElementsByTagName("*");
    var params = null;
    var attrs = null;
    var i = 0;
    var j = 0;
    for (i=0 ; i<elements.length ; i++) {
        if (elements[i].hasAttribute("stonejs")) {
            // First pass
            if (!elements[i].hasAttribute("stonejs-orig-string")) {
                elements[i].setAttribute("stonejs-orig-string", elements[i].innerHTML);
            }

            params = {};
            attrs = elements[i].attributes;
            for (j=0 ; j<attrs.length ; j++) {
                if (attrs[j].name.indexOf("stonejs-param-") == 0) {
                    params[attrs[j].name.substr(14)] = attrs[j].value;
                }
            }

            elements[i].innerHTML = _gettext(elements[i].getAttribute("stonejs-orig-string"), params);
        }
    }
}

module.exports = {
    enableDomScan: enableDomScan,
    updateDomTranslation: updateDomTranslation
};
