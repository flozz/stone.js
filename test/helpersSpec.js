describe("helpers", function () {

    describe("extractLanguages", function () {

        it("returns english by default", function () {
            expect(StoneTest.helpers.extractLanguages(null)).toEqual(["en"]);
            expect(StoneTest.helpers.extractLanguages("")).toEqual(["en"]);
            expect(StoneTest.helpers.extractLanguages("foobarbaz")).toEqual(["en"]);
        });

        it("is able to extract the languages from varous strings", function () {
            expect(StoneTest.helpers.extractLanguages("fr")).toEqual(["fr"]);
            expect(StoneTest.helpers.extractLanguages("FR")).toEqual(["fr"]);
            expect(StoneTest.helpers.extractLanguages("fr_FR")).toEqual(["fr_FR"]);
            expect(StoneTest.helpers.extractLanguages("fr-FR")).toEqual(["fr_FR"]);
            expect(StoneTest.helpers.extractLanguages("fr-FR,en")).toEqual(["fr_FR", "en"]);
            expect(StoneTest.helpers.extractLanguages("fr-FR;en")).toEqual(["fr_FR"]);
            expect(StoneTest.helpers.extractLanguages("fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3"))
                    .toEqual(["fr", "fr_FR", "en_US", "en"]);
        });

        it("sorts languages in the right order", function () {
            expect(StoneTest.helpers.extractLanguages("fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3"))
                    .toEqual(["fr", "fr_FR", "en_US", "en"]);
            expect(StoneTest.helpers.extractLanguages("fr,fr-FR;q=0.8,en-US;q=0.5,en"))
                    .toEqual(["fr", "en", "fr_FR", "en_US"]);
            expect(StoneTest.helpers.extractLanguages("fr;q=0.9,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3,pt_BR;q=1"))
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

            spyOn(cb, "callback").and.callThrough();

            document.addEventListener("stone-event-test", cb.callback);
            StoneTest.helpers.sendEvent("stone-event-test");
        });

        it("can send events with data", function (done) {
            var cb = {};
            cb.callback = function (event) {
                expect(cb.callback).toHaveBeenCalled();
                expect(event.foo).toEqual("bar");
                done();
            };

            spyOn(cb, "callback").and.callThrough();

            document.addEventListener("stone-event-test-data", cb.callback);
            StoneTest.helpers.sendEvent("stone-event-test-data", {foo: "bar"});
        });

    });

    describe("extractPluralForms", function () {
        it("extracts code part conserning plural variable", function () {
            expect(StoneTest.helpers.extractPluralForms("nplurals=2; plural=(n != 1);").trim()).toEqual("(n != 1)");
            expect(StoneTest.helpers.extractPluralForms("nplurals=2; plural=(n > 1);").trim()).toEqual("(n > 1)");
        });
    });

    describe("generatePluralFormsFunction", function () {
        it("generate function for english plural forms", function () {
            var englishPluralForms = StoneTest.helpers.generatePluralFormsFunction("nplurals=2; plural=(n != 1);");
            expect(englishPluralForms(0)).toEqual(1);
            expect(englishPluralForms(1)).toEqual(0);
            expect(englishPluralForms(2)).toEqual(1);
        });

        it("generate function for french plural forms", function () {
            var frenchPluralForms = StoneTest.helpers.generatePluralFormsFunction("nplurals=2; plural=(n > 1);");
            expect(frenchPluralForms(0)).toEqual(0);
            expect(frenchPluralForms(1)).toEqual(0);
            expect(frenchPluralForms(2)).toEqual(1);
        });
    });
});
