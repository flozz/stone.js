describe("helpers", function () {

    describe("extractLanguage", function () {

        it("returns english by default", function () {
            expect(StoneTest.helpers.extractLanguage()).toEqual("en");
            expect(StoneTest.helpers.extractLanguage("")).toEqual("en");
            expect(StoneTest.helpers.extractLanguage("foobarbaz")).toEqual("en");
        });

        it("is able to extract the language from varous strings", function () {
            expect(StoneTest.helpers.extractLanguage("fr")).toEqual("fr");
            expect(StoneTest.helpers.extractLanguage("FR")).toEqual("fr");
            expect(StoneTest.helpers.extractLanguage("fr_FR")).toEqual("fr");
            expect(StoneTest.helpers.extractLanguage("fr-FR")).toEqual("fr");
            expect(StoneTest.helpers.extractLanguage("fr-FR,en")).toEqual("fr");
            expect(StoneTest.helpers.extractLanguage("fr-FR;en")).toEqual("fr");
            expect(StoneTest.helpers.extractLanguage("fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3")).toEqual("fr");
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

            addEventListener("stone-event-test", cb.callback);
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

            addEventListener("stone-event-test-data", cb.callback);
            StoneTest.helpers.sendEvent("stone-event-test-data", {foo: "bar"});
        });

    });
});
