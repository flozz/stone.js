var stonejsHelpers = require("stonejs/src/helpers");

describe("helpers", function () {

    describe("extractLanguages", function () {

        it("returns english by default", function () {
            expect(stonejsHelpers.extractLanguages(null)).toEqual(["en"]);
            expect(stonejsHelpers.extractLanguages("")).toEqual(["en"]);
            expect(stonejsHelpers.extractLanguages("foobarbaz")).toEqual(["en"]);
        });

        it("is able to extract the languages from varous strings", function () {
            expect(stonejsHelpers.extractLanguages("fr")).toEqual(["fr"]);
            expect(stonejsHelpers.extractLanguages("FR")).toEqual(["fr"]);
            expect(stonejsHelpers.extractLanguages("fr_FR")).toEqual(["fr_FR"]);
            expect(stonejsHelpers.extractLanguages("fr-FR")).toEqual(["fr_FR"]);
            expect(stonejsHelpers.extractLanguages("fr-FR,en")).toEqual(["fr_FR", "en"]);
            expect(stonejsHelpers.extractLanguages("fr-FR;en")).toEqual(["fr_FR"]);
            expect(stonejsHelpers.extractLanguages("fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3"))
                    .toEqual(["fr", "fr_FR", "en_US", "en"]);
        });

        it("sorts languages in the right order", function () {
            expect(stonejsHelpers.extractLanguages("fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3"))
                    .toEqual(["fr", "fr_FR", "en_US", "en"]);
            expect(stonejsHelpers.extractLanguages("fr,fr-FR;q=0.8,en-US;q=0.5,en"))
                    .toEqual(["fr", "en", "fr_FR", "en_US"]);
            expect(stonejsHelpers.extractLanguages("fr;q=0.9,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3,pt_BR;q=1"))
                    .toEqual(["pt_BR", "fr", "fr_FR", "en_US", "en"]);
        });

    });

    describe("sendEvent", function () {

        it("can send events", function (done) {
            var cb = {};
            cb.callback = function () {
                expect(cb.callback).toHaveBeenCalled();
                done();
            };

            jest.spyOn(cb, "callback");

            document.addEventListener("stone-event-test", cb.callback);
            stonejsHelpers.sendEvent("stone-event-test");
        });

        it("can send events with data", function (done) {
            var cb = {};
            cb.callback = function (event) {
                expect(cb.callback).toHaveBeenCalled();
                expect(event.foo).toEqual("bar");
                done();
            };

            jest.spyOn(cb, "callback");

            document.addEventListener("stone-event-test-data", cb.callback);
            stonejsHelpers.sendEvent("stone-event-test-data", {foo: "bar"});
        });

    });

    describe("extractPluralExpression", function () {
        it("extracts code part concerning plural variable", function () {
            expect(stonejsHelpers.extractPluralExpression("nplurals=2; plural=(n != 1);").trim())
                .toEqual("(n != 1)");
            expect(stonejsHelpers.extractPluralExpression("nplurals=2; plural=(n > 1);").trim())
                .toEqual("(n > 1)");
        });

        it("handles complex plural forms", function () {
            var arabic = "nplurals=6; plural=" +
                "(n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5);";
            expect(stonejsHelpers.extractPluralExpression(arabic)).toBeDefined();
            var russian = "nplurals=3; plural=" +
                "(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);";
            expect(stonejsHelpers.extractPluralExpression(russian)).toBeDefined();
        });

        it("handles plural forms with line feed character", function () {
            expect(stonejsHelpers.extractPluralExpression("nplurals=2; plural=(n != 1);\n").trim())
                .toEqual("(n != 1)");
            expect(stonejsHelpers.extractPluralExpression("nplurals=2; plural=(n > 1);\\n").trim())
                .toEqual("(n > 1)");
        });

        it("throws error when plural forms are not valid", function () {
            expect(function () {
                stonejsHelpers.extractPluralExpression("nplurals=6; plural=(window.admin=true)? 0 : 1");
            }).toThrowError();
        });
    });

    describe("generatePluralFormsFunction", function () {
        it("generates function for English plural forms", function () {
            var englishPluralForms = stonejsHelpers.generatePluralFormsFunction("nplurals=2; plural=(n != 1);");
            expect(englishPluralForms(0)).toEqual(1);
            expect(englishPluralForms(1)).toEqual(0);
            expect(englishPluralForms(2)).toEqual(1);
        });

        it("generates function for French plural forms", function () {
            var frenchPluralForms = stonejsHelpers.generatePluralFormsFunction("nplurals=2; plural=(n > 1);");
            expect(frenchPluralForms(0)).toEqual(0);
            expect(frenchPluralForms(1)).toEqual(0);
            expect(frenchPluralForms(2)).toEqual(1);
        });
    });
});
