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

        it("handles complex plural forms", function () {
            var arabic = "nplurals=6; plural=" +
                "(n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5);";
            expect(StoneTest.helpers.extractPluralForms(arabic)).toBeDefined();
            var russian = "nplurals=3; plural=" +
                "(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);";
            expect(StoneTest.helpers.extractPluralForms(russian)).toBeDefined();
        });

        it("throws error when plural forms are not valid", function () {
            expect(function () {
                StoneTest.helpers.extractPluralForms("nplurals=6; plural=(window.admin=true)? 0 : 1");
            }).toThrowError();
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
