var stonejs = require("stonejs");
var CATALOGS = require("./data.json");
var testHelpers = require("./helpers.js");

describe("dom localization", function () {

    beforeAll(function () {
        stonejs.addCatalogs(CATALOGS);
        testHelpers.addHtml();
    });

    it("can finds and translate DOM strings", function () {
        var e_translatable1 = document.getElementById("translatable-1");
        var e_notTranslatable1 = document.getElementById("not-translatable-1");

        stonejs.enableDomScan(true);

        stonejs.setLocale(null);
        expect(e_translatable1.innerHTML).toEqual("Hello World");
        expect(e_notTranslatable1.innerHTML).toEqual("Hello World");

        stonejs.setLocale("fr");
        expect(e_translatable1.innerHTML).toEqual("Bonjour le monde");
        expect(e_notTranslatable1.innerHTML).toEqual("Hello World");
    });

    it("can finds and translate DOM strings with replacements", function () {
        var e_translatable2 = document.getElementById("translatable-2");
        var e_notTranslatable2 = document.getElementById("not-translatable-2");

        stonejs.enableDomScan(true);

        stonejs.setLocale(null);
        expect(e_translatable2.innerHTML).toEqual("Hello John");
        expect(e_notTranslatable2.innerHTML).toEqual("Hello {name}");

        stonejs.setLocale("fr");
        expect(e_translatable2.innerHTML).toEqual("Bonjour John");
        expect(e_notTranslatable2.innerHTML).toEqual("Hello {name}");
    });

});
