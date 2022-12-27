var stonejs = require("stonejs");
var CATALOGS = require("./data.json");
var testHelpers = require("./helpers.js");

describe("Stone.js main", function () {

    beforeAll(function () {
        stonejs.addCatalogs(CATALOGS);
    });

    it("sends an event when locale is changed", function (done) {
        function _onStonejsLocaleChanged(event) {
            expect(stonejs.getLocale()).toEqual("testlang");
            document.removeEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
            done();
        }

        document.addEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
        stonejs.setLocale("testlang");
    });

    it("can loads catalogs automatically", function (done) {
        testHelpers.sendEvent("stonejs-autoload-catalogs", {
            catalog: {
                foolang: {
                    messages: {
                        "Hello World": ["Foo bar"],
                    },
                },
            },
        });

        function _onStonejsLocaleChanged(event) {
            expect(stonejs.getLocale()).toEqual("foolang");
            expect(stonejs.gettext("Hello World")).toEqual("Foo bar");
            document.removeEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
            done();
        }

        document.addEventListener("stonejs-locale-changed", _onStonejsLocaleChanged, true);
        stonejs.setLocale("foolang");
    });

});
