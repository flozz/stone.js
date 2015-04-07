CATALOGS = {
    "en": {
        "Hello World": "",
        "Hello {name}": ""
    },
    "fr": {
        "Hello World": "Bonjour le monde",
        "Hello {name}": "Bonjour {name}"
    },
    "it": {
        "Hello World": "Buongiorno il mondo",
        "Hello {name}": "Buongiorno {name}"
    }
};


function _sendEvent(name, data) {
    var data = data || {};
    var ev = null;
    try {
        ev = new Event(name);
    }
    catch (e) {
        // The old-fashioned way... THANK YOU MSIE!
        ev = document.createEvent("Event");
        ev.initEvent(name, true, false);
    }
    for (var i in data) {
        ev[i] = data[i];
    }
    document.dispatchEvent(ev);
}


describe("Stone JS API", function() {

    beforeEach(function() {
        Stone.addCatalogs(CATALOGS);
    });

    it("can switches the locale", function() {
        Stone.setLocale("fr");
        expect(Stone.getLocale()).toEqual("fr");
    });

    it("can translates strings", function() {
        Stone.setLocale(null);
        expect(Stone.gettext("Hello World")).toEqual("Hello World");
        Stone.setLocale("xx");
        expect(Stone.gettext("Hello World")).toEqual("Hello World");
        Stone.setLocale("en");
        expect(Stone.gettext("Hello World")).toEqual("Hello World");
        Stone.setLocale("fr");
        expect(Stone.gettext("Hello World")).toEqual("Bonjour le monde");
        Stone.setLocale("it");
        expect(Stone.gettext("Hello World")).toEqual("Buongiorno il mondo");
    });

    it("can lazy-translates strings", function() {
        var s = Stone.lazyGettext("Hello World");
        Stone.setLocale(null);
        expect(s+"").toEqual("Hello World");
        Stone.setLocale("fr");
        expect(s+"").toEqual("Bonjour le monde");
    });

    it("can translates strings with replacements", function() {
        Stone.setLocale(null);
        expect(Stone.gettext("Hello {name}", {"name": "John"})).toEqual("Hello John");
        Stone.setLocale("xx");
        expect(Stone.gettext("Hello {name}", {"name": "John"})).toEqual("Hello John");
        Stone.setLocale("en");
        expect(Stone.gettext("Hello {name}", {"name": "John"})).toEqual("Hello John");
        Stone.setLocale("fr");
        expect(Stone.gettext("Hello {name}", {"name": "John"})).toEqual("Bonjour John");
        Stone.setLocale("it");
        expect(Stone.gettext("Hello {name}", {"name": "John"})).toEqual("Buongiorno John");
    });

    it("can lazy-translates strings with replacements", function() {
        var s = Stone.lazyGettext("Hello {name}", {"name": "John"});
        Stone.setLocale(null);
        expect(s+"").toEqual("Hello John");
        Stone.setLocale("fr");
        expect(s+"").toEqual("Bonjour John");
    });

    it("send an event when locale is changed", function(done) {
        function _onStonejsLocaleChanged(event) {
            expect(Stone.getLocale()).toEqual("testlang");
            document.removeEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
            done();
        }

        document.addEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
        Stone.setLocale("testlang");
    });

    it("can loads catalogs automatically", function(done) {
        _sendEvent("stonejs-autoload-catalogs", {"catalog": {"foolang": {"Hello World": "Foo bar"}}});

        function _onStonejsLocaleChanged(event) {
            expect(Stone.getLocale()).toEqual("foolang");
            expect(Stone.gettext("Hello World")).toEqual("Foo bar");
            document.removeEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
            done();
        }

        document.addEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
        Stone.setLocale("foolang");
    });

});
