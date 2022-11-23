describe("gettext", function () {

    beforeAll(function () {
        StoneTest.index.clearCatalogs();
        StoneTest.index.addCatalogs(CATALOGS);
    });

    describe("setLocale", function () {

        it("can switches the locale", function () {
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.getLocale()).toEqual("fr");
        });

    });

    describe("listCatalogs", function () {

        it("can list all the catalogs", function () {
            StoneTest.index.listCatalogs();
            expect(StoneTest.index.listCatalogs()).toContain("fr");
            expect(StoneTest.index.listCatalogs()).toContain("en");
            expect(StoneTest.index.listCatalogs()).toContain("it");
            expect(StoneTest.index.listCatalogs().length).toEqual(3);
        });

    });

    describe("setBestMatchingLocale", function () {

        beforeAll(function () {
            StoneTest.index.addCatalogs({
                // en, fr, it +
                fr_FR: {},
                fr_ca: {},
                "fr-be": {},
                pt_BR: {},
                es_ES: {},
                es_AR: {},
                de: {},
                foolang: {}
            });
        });

        beforeEach(function () {
            StoneTest.gettext.setLocale("c");
        });

        it("accepts a single string", function () {
            StoneTest.gettext.setBestMatchingLocale("fr");
            expect(StoneTest.index.getLocale()).toEqual("fr");
        });

        it("accepts an array of string", function () {
            StoneTest.gettext.setBestMatchingLocale(["fr"]);
            expect(StoneTest.index.getLocale()).toEqual("fr");
        });

        it("selects 'c' as locale if nothing matches", function () {
            StoneTest.gettext.setBestMatchingLocale("foobarbaz");
            expect(StoneTest.index.getLocale()).toEqual("c");
        });

        it("selects the right language with a perfect matching", function () {
            StoneTest.gettext.setBestMatchingLocale("fr");
            expect(StoneTest.index.getLocale()).toEqual("fr");

            StoneTest.gettext.setBestMatchingLocale("FR");
            expect(StoneTest.index.getLocale()).toEqual("fr");

            StoneTest.gettext.setBestMatchingLocale("fr_FR");
            expect(StoneTest.index.getLocale()).toEqual("fr_FR");

            StoneTest.gettext.setBestMatchingLocale("fr_fr");
            expect(StoneTest.index.getLocale()).toEqual("fr_FR");

            StoneTest.gettext.setBestMatchingLocale("fr-fr");
            expect(StoneTest.index.getLocale()).toEqual("fr_FR");

            StoneTest.gettext.setBestMatchingLocale("fr-be");
            expect(StoneTest.index.getLocale()).toEqual("fr-be");

            StoneTest.gettext.setBestMatchingLocale("fr_BE");
            expect(StoneTest.index.getLocale()).toEqual("fr-be");
        });

        it("selects the right language with a partial match (language provided but no lect)", function () {
            StoneTest.gettext.setBestMatchingLocale("it");
            expect(StoneTest.index.getLocale()).toEqual("it");

            StoneTest.gettext.setBestMatchingLocale("es");
            expect(StoneTest.index.getLocale()).toEqual("es_ES");

            StoneTest.gettext.setBestMatchingLocale("pt");
            expect(StoneTest.index.getLocale()).toEqual("pt_BR");
        });

        it("selects the right language with a partial match (language provided with lect)", function () {
            StoneTest.gettext.setBestMatchingLocale("de_LU");
            expect(StoneTest.index.getLocale()).toEqual("de");

            StoneTest.gettext.setBestMatchingLocale("pt_PT");
            expect(StoneTest.index.getLocale()).toEqual("pt_BR");
        });

        it("selects the best matching language from a list", function () {
            StoneTest.gettext.setBestMatchingLocale(["es", "es_AR", "fr_FR"]);
            expect(StoneTest.index.getLocale()).toEqual("es_AR");

            StoneTest.gettext.setBestMatchingLocale(["es", "fr_FR"]);
            expect(StoneTest.index.getLocale()).toEqual("es_ES");
        });

        it("selects the right catalogs with wrong locale names", function () {
            StoneTest.gettext.setBestMatchingLocale(["foolang"]);
            expect(StoneTest.index.getLocale()).toEqual("foolang");
        });

        it("selects the 'c' language if nothing matches", function () {
            StoneTest.gettext.setBestMatchingLocale(["fr"]);
            expect(StoneTest.index.getLocale()).toEqual("fr");

            StoneTest.gettext.setBestMatchingLocale(["xxx"]);
            expect(StoneTest.index.getLocale()).toEqual("c");
        });

    });

    describe("gettext_noop", function () {

        it("doest not operate translation", function () {
            var someString = "Some string to translate later";
            expect(StoneTest.index.gettext_noop(someString)).toEqual(someString);
        });
    });

    describe("gettext", function () {

        describe("With legacy catalog format", function () {

            it("can translate strings", function () {
                StoneTest.index.setLocale(null);
                expect(StoneTest.index.gettext("Hello World")).toEqual("Hello World");
                StoneTest.index.setLocale("xx");
                expect(StoneTest.index.gettext("Hello World")).toEqual("Hello World");
                StoneTest.index.setLocale("en");
                expect(StoneTest.index.gettext("Hello World")).toEqual("Hello World");
                StoneTest.index.setLocale("fr");
                expect(StoneTest.index.gettext("Hello World")).toEqual("Bonjour le monde");
                StoneTest.index.setLocale("it");
                expect(StoneTest.index.gettext("Hello World")).toEqual("Buongiorno il mondo");
                expect(StoneTest.index.gettext("Hello World", "fr")).toEqual("Bonjour le monde");
            });

            it("can translate strings with replacements", function () {
                StoneTest.index.setLocale(null);
                expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Hello John");
                StoneTest.index.setLocale("xx");
                expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Hello John");
                StoneTest.index.setLocale("en");
                expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Hello John");
                StoneTest.index.setLocale("fr");
                expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Bonjour John");
                StoneTest.index.setLocale("it");
                expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Buongiorno John");
                expect(StoneTest.index.gettext("Hello {name}", {name: "John"}, "fr")).toEqual("Bonjour John");
            });

        });

        describe("With context compatible catalog format", function () {

            it("can translate strings", function () {
                StoneTest.index.setLocale(null);
                expect(StoneTest.index.gettext("File")).toEqual("File");
                StoneTest.index.setLocale("xx");
                expect(StoneTest.index.gettext("File")).toEqual("File");
                StoneTest.index.setLocale("en");
                expect(StoneTest.index.gettext("File")).toEqual("File");
                StoneTest.index.setLocale("fr");
                expect(StoneTest.index.gettext("File")).toEqual("Fichier");
                StoneTest.index.setLocale("it");
                expect(StoneTest.index.gettext("File")).toEqual("Filo");

                expect(StoneTest.index.gettext("File", "fr")).toEqual("Fichier");
            });

            it("can translate strings with replacements", function () {
                StoneTest.index.setLocale(null);
                expect(StoneTest.index.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Welcome back, John!");
                StoneTest.index.setLocale("xx");
                expect(StoneTest.index.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Welcome back, John!");
                StoneTest.index.setLocale("en");
                expect(StoneTest.index.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Welcome back, John!");
                StoneTest.index.setLocale("fr");
                expect(StoneTest.index.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Heureux de vous revoir, John!");
                StoneTest.index.setLocale("it");
                expect(StoneTest.index.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Bentornato, John!");
                expect(StoneTest.index.gettext("Welcome back, {name}!", {name: "John"}, "fr"))
                    .toEqual("Heureux de vous revoir, John!");
            });
        });
    });

    describe("lazyGettext", function () {

        it("can translate strings", function () {
            var s = StoneTest.index.lazyGettext("Hello World");
            StoneTest.index.setLocale(null);
            expect(String(s)).toEqual("Hello World");
            StoneTest.index.setLocale("fr");
            expect(String(s)).toEqual("Bonjour le monde");
        });

        it("can translate strings with replacements", function () {
            var s = StoneTest.index.lazyGettext("Hello {name}", {name: "John"});
            StoneTest.index.setLocale(null);
            expect(String(s)).toEqual("Hello John");
            StoneTest.index.setLocale("fr");
            expect(String(s)).toEqual("Bonjour John");
        });

    });

    describe("LazyString", function () {

        beforeAll(function () {
            StoneTest.index.setLocale("fr");
        });

        beforeEach(function () {
            this.lazy = new StoneTest.index.LazyString("Hello World");
        });

        it("can translate text", function () {
            expect(this.lazy.toString()).toEqual("Bonjour le monde");
        });

        it("can mimic the String API", function () {
            var stringProps = Object.getOwnPropertyNames(String.prototype);
            var lazyProps = Object.getOwnPropertyNames(this.lazy);
            for (var i = 0 ; i < stringProps.length ; i++) {
                expect(lazyProps).toContain(stringProps[i]);
            }
        });

        it("can give the translated string length", function () {
            expect(this.lazy.length).toEqual(16);
        });

        it("can return the translated string in lowerCase", function () {
            expect(this.lazy.toLowerCase()).toEqual("bonjour le monde");
        });

        it("can return a splitted translated string", function () {
            expect(this.lazy.split(" ")).toEqual(["Bonjour", "le", "monde"]);
        });

    });

    describe("ngettext", function () {

        describe("With legacy catalog format", function () {

            it("can translate strings", function () {
                StoneTest.index.setLocale(null);
                expect(StoneTest.index.ngettext("horse", "horses", 0)).toEqual("horses");
                expect(StoneTest.index.ngettext("horse", "horses", 1)).toEqual("horse");
                expect(StoneTest.index.ngettext("horse", "horses", 2)).toEqual("horses");
                StoneTest.index.setLocale("xx");
                expect(StoneTest.index.ngettext("horse", "horses", 0)).toEqual("horses");
                expect(StoneTest.index.ngettext("horse", "horses", 1)).toEqual("horse");
                expect(StoneTest.index.ngettext("horse", "horses", 2)).toEqual("horses");
                StoneTest.index.setLocale("en");
                expect(StoneTest.index.ngettext("horse", "horses", 0)).toEqual("horses");
                expect(StoneTest.index.ngettext("horse", "horses", 1)).toEqual("horse");
                expect(StoneTest.index.ngettext("horse", "horses", 2)).toEqual("horses");
                StoneTest.index.setLocale("fr");
                expect(StoneTest.index.ngettext("horse", "horses", 0)).toEqual("cheval");
                expect(StoneTest.index.ngettext("horse", "horses", 1)).toEqual("cheval");
                expect(StoneTest.index.ngettext("horse", "horses", 2)).toEqual("chevaux");
                StoneTest.index.setLocale("it");
                expect(StoneTest.index.ngettext("horse", "horses", 0)).toEqual("cavalli");
                expect(StoneTest.index.ngettext("horse", "horses", 1)).toEqual("cavallo");
                expect(StoneTest.index.ngettext("horse", "horses", 2)).toEqual("cavalli");
            });

            it("can translate strings with replacements", function () {
                StoneTest.index.setLocale(null);
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 apples");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 apple");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 apples");
                StoneTest.index.setLocale("xx");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 apples");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 apple");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 apples");
                StoneTest.index.setLocale("en");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 apples");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 apple");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 apples");
                StoneTest.index.setLocale("fr");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 pomme");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 pomme");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 pommes");
                StoneTest.index.setLocale("it");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 mele");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 mela");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 mele");
            });

            it("provides given number as implicit replacement", function () {
                StoneTest.index.setLocale(null);
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 apples");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 apple");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 apples");
                StoneTest.index.setLocale("xx");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 apples");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 apple");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 apples");
                StoneTest.index.setLocale("en");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 apples");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 apple");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 apples");
                StoneTest.index.setLocale("fr");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 pomme");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 pomme");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 pommes");
                StoneTest.index.setLocale("it");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 mele");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 mela");
                expect(StoneTest.index.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 mele");
            });
        });

        describe("With context compatible catalog format", function () {

            it("can translate strings", function () {
                StoneTest.index.setLocale(null);
                expect(StoneTest.index.ngettext("car", "cars", 0)).toEqual("cars");
                expect(StoneTest.index.ngettext("car", "cars", 1)).toEqual("car");
                expect(StoneTest.index.ngettext("car", "cars", 2)).toEqual("cars");
                StoneTest.index.setLocale("xx");
                expect(StoneTest.index.ngettext("car", "cars", 0)).toEqual("cars");
                expect(StoneTest.index.ngettext("car", "cars", 1)).toEqual("car");
                expect(StoneTest.index.ngettext("car", "cars", 2)).toEqual("cars");
                StoneTest.index.setLocale("en");
                expect(StoneTest.index.ngettext("car", "cars", 0)).toEqual("cars");
                expect(StoneTest.index.ngettext("car", "cars", 1)).toEqual("car");
                expect(StoneTest.index.ngettext("car", "cars", 2)).toEqual("cars");
                StoneTest.index.setLocale("fr");
                expect(StoneTest.index.ngettext("car", "cars", 0)).toEqual("voiture");
                expect(StoneTest.index.ngettext("car", "cars", 1)).toEqual("voiture");
                expect(StoneTest.index.ngettext("car", "cars", 2)).toEqual("voitures");
                StoneTest.index.setLocale("it");
                expect(StoneTest.index.ngettext("car", "cars", 0)).toEqual("macchine");
                expect(StoneTest.index.ngettext("car", "cars", 1)).toEqual("macchina");
                expect(StoneTest.index.ngettext("car", "cars", 2)).toEqual("macchine");
            });
        });
    });

    describe("LazyNString", function () {

        beforeAll(function () {
            StoneTest.index.setLocale("fr");
        });

        beforeEach(function () {
            this.lazy = new StoneTest.index.LazyNString("{n} apple", "{n} apples", 2);
        });

        it("can translate text", function () {
            expect(this.lazy.toString()).toEqual("2 pommes");
        });

        it("can mimic the String API", function () {
            var stringProps = Object.getOwnPropertyNames(String.prototype);
            var lazyProps = Object.getOwnPropertyNames(this.lazy);
            for (var i = 0 ; i < stringProps.length ; i++) {
                expect(lazyProps).toContain(stringProps[i]);
            }
        });

        it("can give the translated string length", function () {
            expect(this.lazy.length).toEqual("2 pommes".length);
        });

        it("can return the translated string in upperCase", function () {
            expect(this.lazy.toUpperCase()).toEqual("2 POMMES");
        });

        it("can return a splitted translated string", function () {
            expect(this.lazy.split(" ")).toEqual(["2", "pommes"]);
        });

    });

    describe("pgettext", function () {

        it("can translate strings", function () {
            StoneTest.index.setLocale(null);
            expect(StoneTest.index.pgettext("back of an object", "Back")).toEqual("Back");
            expect(StoneTest.index.pgettext("going back/getting out", "Back")).toEqual("Back");
            StoneTest.index.setLocale("xx");
            expect(StoneTest.index.pgettext("back of an object", "Back")).toEqual("Back");
            expect(StoneTest.index.pgettext("going back/getting out", "Back")).toEqual("Back");
            StoneTest.index.setLocale("en");
            expect(StoneTest.index.pgettext("back of an object", "Back")).toEqual("Back");
            expect(StoneTest.index.pgettext("going back/getting out", "Back")).toEqual("Back");
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.pgettext("back of an object", "Back")).toEqual("Arrière");
            expect(StoneTest.index.pgettext("going back/getting out", "Back")).toEqual("Retour");
            StoneTest.index.setLocale("it");
            expect(StoneTest.index.pgettext("back of an object", "Back")).toEqual("Posteriore");
            expect(StoneTest.index.pgettext("going back/getting out", "Back")).toEqual("Andare");

            expect(StoneTest.index.pgettext("back of an object", "Back", "fr")).toEqual("Arrière");

            // context does not match
            StoneTest.index.setLocale(null);
            expect(StoneTest.index.pgettext("body spine", "Back")).toEqual("Back");
            expect(StoneTest.index.pgettext("body spine", "Back", "fr")).toEqual("Back");
        });

        it("can translate strings with replacements", function () {
            StoneTest.index.setLocale(null);
            expect(StoneTest.index.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Go to Paris");
            expect(StoneTest.index.pgettext("infinitive", "Go to {destination}", {destination: "Checkout"})).
                toEqual("Go to Checkout");
            StoneTest.index.setLocale("xx");
            expect(StoneTest.index.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Go to Paris");
            expect(StoneTest.index.pgettext("infinitive", "Go to {destination}", {destination: "Checkout"}))
                .toEqual("Go to Checkout");
            StoneTest.index.setLocale("en");
            expect(StoneTest.index.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Go to Paris");
            expect(StoneTest.index.pgettext("infinitive", "Go to {destination}", {destination: "Checkout"}))
                .toEqual("Go to Checkout");
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Allez à Paris");
            expect(StoneTest.index.pgettext(
                "infinitive",
                "Go to {destination}",
                {destination: "l'interface de paiement"}
            )).toEqual("Aller à l'interface de paiement");
            StoneTest.index.setLocale("it");
            expect(StoneTest.index.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Vai a Paris");
            expect(StoneTest.index.pgettext(
                "infinitive",
                "Go to {destination}",
                {destination: "alla pagina di pagamento"}
            )).toEqual("Andare alla pagina di pagamento");

            expect(StoneTest.index.pgettext("imperative", "Go to {destination}", {destination: "Paris"}, "fr"))
                .toEqual("Allez à Paris");
            expect(StoneTest.index.pgettext(
                "infinitive",
                "Go to {destination}",
                {destination: "l'interface de paiement"},
                "fr"
            )).toEqual("Aller à l'interface de paiement");
        });
    });

    describe("lazyPgettext", function () {

        it("can translate strings", function () {
            var s = StoneTest.index.lazyPgettext("back of an object", "Back");
            StoneTest.index.setLocale(null);
            expect(String(s)).toEqual("Back");
            StoneTest.index.setLocale("fr");
            expect(String(s)).toEqual("Arrière");
        });

        it("can translate strings with replacements", function () {
            var s = StoneTest.index.lazyPgettext("imperative", "Go to {destination}", {destination: "John's house"});
            StoneTest.index.setLocale(null);
            expect(String(s)).toEqual("Go to John's house");
            StoneTest.index.setLocale("fr");
            expect(String(s)).toEqual("Allez à John's house");
        });

    });

    describe("LazyPString", function () {

        beforeAll(function () {
            StoneTest.index.setLocale("fr");
        });

        beforeEach(function () {
            this.lazy = new StoneTest.index.LazyPString("back of an object", "Back");
        });

        it("can translate text", function () {
            expect(this.lazy.toString()).toEqual("Arrière");
        });

        it("can mimic the String API", function () {
            var stringProps = Object.getOwnPropertyNames(String.prototype);
            var lazyProps = Object.getOwnPropertyNames(this.lazy);
            for (var i = 0 ; i < stringProps.length ; i++) {
                expect(lazyProps).toContain(stringProps[i]);
            }
        });

        it("can give the translated string length", function () {
            expect(this.lazy.length).toEqual("Arrière".length);
        });

        it("can return the translated string in lowerCase", function () {
            expect(this.lazy.toLowerCase()).toEqual("arrière");
        });

        it("can return a splitted translated string", function () {
            expect(this.lazy.split(" ")).toEqual(["Arrière"]);
        });
    });

    describe("npgettext", function () {

        it("can translate strings with replacements", function () {
            StoneTest.index.setLocale(null);
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            StoneTest.index.setLocale("xx");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            StoneTest.index.setLocale("en");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 instrument à cordes");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 instrument à cordes");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 instruments à cordes");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 chaîne de caractères");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 chaîne de caractères");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 chaînes de caractères");
            StoneTest.index.setLocale("it");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strumenti a corda");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 strumento a corda");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strumenti a corda");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 stringhe");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 stringa");
            expect(StoneTest.index.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 stringhe");

            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}, "fr"))
                .toEqual("0 instrument à cordes");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}, "fr"))
                .toEqual("1 instrument à cordes");
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}, "fr"))
                .toEqual("2 instruments à cordes");

            // implicit number
            expect(StoneTest.index.npgettext("musical instrument", "{n} string", "{n} strings", 0, "fr"))
                .toEqual("0 instrument à cordes");

            // context does not match
            StoneTest.index.setLocale(null);
            expect(StoneTest.index.npgettext(
                "tool made of lots of textile filaments",
                "{n} string",
                "{n} strings",
                0,
                {n: 0}
            )).toEqual("0 strings");
            expect(StoneTest.index.npgettext(
                "tool made of lots of textile filaments",
                "{n} string",
                "{n} strings",
                0,
                {n: 0},
                "fr"
            )).toEqual("0 strings");
        });

        it("can translate strings", function () {
            StoneTest.index.setLocale(null);
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 0)).toEqual("Files");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 1)).toEqual("File");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 2)).toEqual("Files");
            StoneTest.index.setLocale("xx");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 0)).toEqual("Files");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 1)).toEqual("File");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 2)).toEqual("Files");
            StoneTest.index.setLocale("en");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 0)).toEqual("Files");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 1)).toEqual("File");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 2)).toEqual("Files");
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 0)).toEqual("Fichier");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 1)).toEqual("Fichier");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 2)).toEqual("Fichiers");
            StoneTest.index.setLocale("it");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 0)).toEqual("File");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 1)).toEqual("Filo");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 2)).toEqual("File");

            expect(StoneTest.index.npgettext("computer file", "File", "Files", 0, "fr")).toEqual("Fichier");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 1, "fr")).toEqual("Fichier");
            expect(StoneTest.index.npgettext("computer file", "File", "Files", 2, "fr")).toEqual("Fichiers");
        });
    });

    describe("lazyNpgettext", function () {

        it("can translate strings", function () {
            var s = StoneTest.index.lazyNpgettext("computer file", "File", "Files", 1);
            StoneTest.index.setLocale(null);
            expect(String(s)).toEqual("File");
            StoneTest.index.setLocale("fr");
            expect(String(s)).toEqual("Fichier");
        });

        it("can translate strings with replacements", function () {
            var s = StoneTest.index.lazyNpgettext("musical instrument", "{n} string", "{n} strings", 0);
            StoneTest.index.setLocale(null);
            expect(String(s)).toEqual("0 strings");
            StoneTest.index.setLocale("fr");
            expect(String(s)).toEqual("0 instrument à cordes");
        });
    });

    describe("LazyNPString", function () {
        beforeAll(function () {
            StoneTest.index.setLocale("fr");
        });

        beforeEach(function () {
            this.lazy = new StoneTest.index.LazyNPString("musical instrument", "{n} string", "{n} strings", 2);
        });

        it("can translate text", function () {
            expect(this.lazy.toString()).toEqual("2 instruments à cordes");
        });

        it("can mimic the String API", function () {
            var stringProps = Object.getOwnPropertyNames(String.prototype);
            var lazyProps = Object.getOwnPropertyNames(this.lazy);
            for (var i = 0 ; i < stringProps.length ; i++) {
                expect(lazyProps).toContain(stringProps[i]);
            }
        });

        it("can give the translated string length", function () {
            expect(this.lazy.length).toEqual("2 instruments à cordes".length);
        });

        it("can return the translated string in upperCase", function () {
            expect(this.lazy.toUpperCase()).toEqual("2 INSTRUMENTS À CORDES");
        });

        it("can return a splitted translated string", function () {
            expect(this.lazy.split(" ")).toEqual(["2", "instruments", "à", "cordes"]);
        });
    });

    describe("catalogs", function () {

        beforeAll(function () {
            StoneTest.index.clearCatalogs();
            StoneTest.index.addCatalogs({
                fr: {
                    "plural-forms": "nplurals=2; plural=(n > 1);",
                    messages: {
                        Hello: ["Bonjour"],
                        World: ["Monde"]
                    }
                },
                it: {
                    "plural-forms": "nplurals=2; plural=(n != 1);",
                    messages: {
                        Hello: ["Buongiorno"]
                    }
                }
            });

            StoneTest.index.addCatalogs({
                fr: {
                    "plural-forms": "nplurals=2; plural=(n > 1);",
                    messages: {
                        Hello: ["Salut"]
                    }
                },
                en: {
                    "plural-forms": "nplurals=2; plural=(n != 1);",
                    messages: {
                        Hello: ["Hi"]
                    }
                }
            });
        });

        it("are merged when multi-source are added", function () {
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.gettext("Hello")).toEqual("Salut");
            expect(StoneTest.index.gettext("World")).toEqual("Monde");

            StoneTest.index.setLocale("it");
            expect(StoneTest.index.gettext("Hello")).toEqual("Buongiorno");

            StoneTest.index.setLocale("en");
            expect(StoneTest.index.gettext("Hello")).toEqual("Hi");
        });

    });

});
