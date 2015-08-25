describe("Stone.js main", function () {

    beforeAll(function () {
        StoneTest.index.addCatalogs(CATALOGS);
    });

    it("sends an event when locale is changed", function (done) {
        function _onStonejsLocaleChanged(event) {
            expect(StoneTest.index.getLocale()).toEqual("testlang");
            document.removeEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
            done();
        }

        document.addEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
        StoneTest.index.setLocale("testlang");
    });

    it("can loads catalogs automatically", function (done) {
        _sendEvent("stonejs-autoload-catalogs", {catalog: {foolang: {messages: {"Hello World": ["Foo bar"]}}}});

        function _onStonejsLocaleChanged(event) {
            expect(StoneTest.index.getLocale()).toEqual("foolang");
            expect(StoneTest.index.gettext("Hello World")).toEqual("Foo bar");
            document.removeEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
            done();
        }

        document.addEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
        StoneTest.index.setLocale("foolang");
    });

});
