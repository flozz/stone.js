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

function addHtml() {
    var _html = "<br />Translatable DOM:";
    _html += "<ul>";
    _html += "    <li stonejs id=\"translatable-1\">Hello World</li>";
    _html += "    <li stonejs stonejs-param-name=\"John\" id=\"translatable-2\">Hello {name}</li>";
    _html += "</ul>";
    _html += "Not Translatable DOM:";
    _html += "<ul>";
    _html += "    <li id=\"not-translatable-1\">Hello World</li>";
    _html += "    <li id=\"not-translatable-2\">Hello {name}</li>";
    _html += "</ul>";

    document.getElementsByTagName("body")[0].innerHTML += _html;
}

module.exports = {
    sendEvent: sendEvent,
    addHtml: addHtml,
};
