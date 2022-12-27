var stonejs = require("stonejs");
var CATALOGS = require("./data.json");

describe("gettext", function () {

    beforeAll(function () {
        stonejs.clearCatalogs();
        stonejs.addCatalogs(CATALOGS);
    });

    describe("setLocale", function () {

        it("can switches the locale", function () {
            stonejs.setLocale("fr");
            expect(stonejs.getLocale()).toEqual("fr");
        });

    });

    describe("listCatalogs", function () {

        it("can list all the catalogs", function () {
            stonejs.listCatalogs();
            expect(stonejs.listCatalogs()).toContain("fr");
            expect(stonejs.listCatalogs()).toContain("en");
            expect(stonejs.listCatalogs()).toContain("it");
            expect(stonejs.listCatalogs().length).toEqual(3);
        });

    });

    describe("setBestMatchingLocale", function () {

        beforeAll(function () {
            stonejs.addCatalogs({
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
            stonejs.setLocale("c");
        });

        it("accepts a single string", function () {
            stonejs.setBestMatchingLocale("fr");
            expect(stonejs.getLocale()).toEqual("fr");
        });

        it("accepts an array of string", function () {
            stonejs.setBestMatchingLocale(["fr"]);
            expect(stonejs.getLocale()).toEqual("fr");
        });

        it("selects 'c' as locale if nothing matches", function () {
            stonejs.setBestMatchingLocale("foobarbaz");
            expect(stonejs.getLocale()).toEqual("c");
        });

        it("selects the right language with a perfect matching", function () {
            stonejs.setBestMatchingLocale("fr");
            expect(stonejs.getLocale()).toEqual("fr");

            stonejs.setBestMatchingLocale("FR");
            expect(stonejs.getLocale()).toEqual("fr");

            stonejs.setBestMatchingLocale("fr_FR");
            expect(stonejs.getLocale()).toEqual("fr_FR");

            stonejs.setBestMatchingLocale("fr_fr");
            expect(stonejs.getLocale()).toEqual("fr_FR");

            stonejs.setBestMatchingLocale("fr-fr");
            expect(stonejs.getLocale()).toEqual("fr_FR");

            stonejs.setBestMatchingLocale("fr-be");
            expect(stonejs.getLocale()).toEqual("fr-be");

            stonejs.setBestMatchingLocale("fr_BE");
            expect(stonejs.getLocale()).toEqual("fr-be");
        });

        it("selects the right language with a partial match (language provided but no lect)", function () {
            stonejs.setBestMatchingLocale("it");
            expect(stonejs.getLocale()).toEqual("it");

            stonejs.setBestMatchingLocale("es");
            expect(stonejs.getLocale()).toEqual("es_ES");

            stonejs.setBestMatchingLocale("pt");
            expect(stonejs.getLocale()).toEqual("pt_BR");
        });

        it("selects the right language with a partial match (language provided with lect)", function () {
            stonejs.setBestMatchingLocale("de_LU");
            expect(stonejs.getLocale()).toEqual("de");

            stonejs.setBestMatchingLocale("pt_PT");
            expect(stonejs.getLocale()).toEqual("pt_BR");
        });

        it("selects the best matching language from a list", function () {
            stonejs.setBestMatchingLocale(["es", "es_AR", "fr_FR"]);
            expect(stonejs.getLocale()).toEqual("es_AR");

            stonejs.setBestMatchingLocale(["es", "fr_FR"]);
            expect(stonejs.getLocale()).toEqual("es_ES");
        });

        it("selects the right catalogs with wrong locale names", function () {
            stonejs.setBestMatchingLocale(["foolang"]);
            expect(stonejs.getLocale()).toEqual("foolang");
        });

        it("selects the 'c' language if nothing matches", function () {
            stonejs.setBestMatchingLocale(["fr"]);
            expect(stonejs.getLocale()).toEqual("fr");

            stonejs.setBestMatchingLocale(["xxx"]);
            expect(stonejs.getLocale()).toEqual("c");
        });

    });

    describe("gettext_noop", function () {

        it("doest not operate translation", function () {
            var someString = "Some string to translate later";
            expect(stonejs.gettext_noop(someString)).toEqual(someString);
        });
    });

    describe("gettext", function () {

        describe("With legacy catalog format", function () {

            it("can translate strings", function () {
                stonejs.setLocale(null);
                expect(stonejs.gettext("Hello World")).toEqual("Hello World");
                stonejs.setLocale("xx");
                expect(stonejs.gettext("Hello World")).toEqual("Hello World");
                stonejs.setLocale("en");
                expect(stonejs.gettext("Hello World")).toEqual("Hello World");
                stonejs.setLocale("fr");
                expect(stonejs.gettext("Hello World")).toEqual("Bonjour le monde");
                stonejs.setLocale("it");
                expect(stonejs.gettext("Hello World")).toEqual("Buongiorno il mondo");
                expect(stonejs.gettext("Hello World", "fr")).toEqual("Bonjour le monde");
            });

            it("can translate strings with replacements", function () {
                stonejs.setLocale(null);
                expect(stonejs.gettext("Hello {name}", {name: "John"})).toEqual("Hello John");
                stonejs.setLocale("xx");
                expect(stonejs.gettext("Hello {name}", {name: "John"})).toEqual("Hello John");
                stonejs.setLocale("en");
                expect(stonejs.gettext("Hello {name}", {name: "John"})).toEqual("Hello John");
                stonejs.setLocale("fr");
                expect(stonejs.gettext("Hello {name}", {name: "John"})).toEqual("Bonjour John");
                stonejs.setLocale("it");
                expect(stonejs.gettext("Hello {name}", {name: "John"})).toEqual("Buongiorno John");
                expect(stonejs.gettext("Hello {name}", {name: "John"}, "fr")).toEqual("Bonjour John");
            });

        });

        describe("With context compatible catalog format", function () {

            it("can translate strings", function () {
                stonejs.setLocale(null);
                expect(stonejs.gettext("File")).toEqual("File");
                stonejs.setLocale("xx");
                expect(stonejs.gettext("File")).toEqual("File");
                stonejs.setLocale("en");
                expect(stonejs.gettext("File")).toEqual("File");
                stonejs.setLocale("fr");
                expect(stonejs.gettext("File")).toEqual("Fichier");
                stonejs.setLocale("it");
                expect(stonejs.gettext("File")).toEqual("File");

                expect(stonejs.gettext("File", "fr")).toEqual("Fichier");
            });

            it("can translate strings with replacements", function () {
                stonejs.setLocale(null);
                expect(stonejs.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Welcome back, John!");
                stonejs.setLocale("xx");
                expect(stonejs.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Welcome back, John!");
                stonejs.setLocale("en");
                expect(stonejs.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Welcome back, John!");
                stonejs.setLocale("fr");
                expect(stonejs.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Heureux de vous revoir, John!");
                stonejs.setLocale("it");
                expect(stonejs.gettext("Welcome back, {name}!", {name: "John"}))
                    .toEqual("Bentornato, John!");
                expect(stonejs.gettext("Welcome back, {name}!", {name: "John"}, "fr"))
                    .toEqual("Heureux de vous revoir, John!");
            });
        });
    });

    describe("lazyGettext", function () {

        it("can translate strings", function () {
            var s = stonejs.lazyGettext("Hello World");
            stonejs.setLocale(null);
            expect(String(s)).toEqual("Hello World");
            stonejs.setLocale("fr");
            expect(String(s)).toEqual("Bonjour le monde");
        });

        it("can translate strings with replacements", function () {
            var s = stonejs.lazyGettext("Hello {name}", {name: "John"});
            stonejs.setLocale(null);
            expect(String(s)).toEqual("Hello John");
            stonejs.setLocale("fr");
            expect(String(s)).toEqual("Bonjour John");
        });

    });

    describe("LazyString", function () {

        beforeAll(function () {
            stonejs.setLocale("fr");
        });

        beforeEach(function () {
            this.lazy = new stonejs.LazyString("Hello World");
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
                stonejs.setLocale(null);
                expect(stonejs.ngettext("horse", "horses", 0)).toEqual("horses");
                expect(stonejs.ngettext("horse", "horses", 1)).toEqual("horse");
                expect(stonejs.ngettext("horse", "horses", 2)).toEqual("horses");
                stonejs.setLocale("xx");
                expect(stonejs.ngettext("horse", "horses", 0)).toEqual("horses");
                expect(stonejs.ngettext("horse", "horses", 1)).toEqual("horse");
                expect(stonejs.ngettext("horse", "horses", 2)).toEqual("horses");
                stonejs.setLocale("en");
                expect(stonejs.ngettext("horse", "horses", 0)).toEqual("horses");
                expect(stonejs.ngettext("horse", "horses", 1)).toEqual("horse");
                expect(stonejs.ngettext("horse", "horses", 2)).toEqual("horses");
                stonejs.setLocale("fr");
                expect(stonejs.ngettext("horse", "horses", 0)).toEqual("cheval");
                expect(stonejs.ngettext("horse", "horses", 1)).toEqual("cheval");
                expect(stonejs.ngettext("horse", "horses", 2)).toEqual("chevaux");
                stonejs.setLocale("it");
                expect(stonejs.ngettext("horse", "horses", 0)).toEqual("cavalli");
                expect(stonejs.ngettext("horse", "horses", 1)).toEqual("cavallo");
                expect(stonejs.ngettext("horse", "horses", 2)).toEqual("cavalli");
            });

            it("can translate strings with replacements", function () {
                stonejs.setLocale(null);
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 apples");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 apple");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 apples");
                stonejs.setLocale("xx");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 apples");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 apple");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 apples");
                stonejs.setLocale("en");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 apples");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 apple");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 apples");
                stonejs.setLocale("fr");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 pomme");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 pomme");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 pommes");
                stonejs.setLocale("it");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0, {n: 0})).toEqual("0 mele");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1, {n: 1})).toEqual("1 mela");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2, {n: 2})).toEqual("2 mele");
            });

            it("provides given number as implicit replacement", function () {
                stonejs.setLocale(null);
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 apples");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 apple");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 apples");
                stonejs.setLocale("xx");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 apples");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 apple");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 apples");
                stonejs.setLocale("en");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 apples");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 apple");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 apples");
                stonejs.setLocale("fr");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 pomme");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 pomme");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 pommes");
                stonejs.setLocale("it");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 0)).toEqual("0 mele");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 1)).toEqual("1 mela");
                expect(stonejs.ngettext("{n} apple", "{n} apples", 2)).toEqual("2 mele");
            });
        });

        describe("With context compatible catalog format", function () {

            it("can translate strings", function () {
                stonejs.setLocale(null);
                expect(stonejs.ngettext("car", "cars", 0)).toEqual("cars");
                expect(stonejs.ngettext("car", "cars", 1)).toEqual("car");
                expect(stonejs.ngettext("car", "cars", 2)).toEqual("cars");
                stonejs.setLocale("xx");
                expect(stonejs.ngettext("car", "cars", 0)).toEqual("cars");
                expect(stonejs.ngettext("car", "cars", 1)).toEqual("car");
                expect(stonejs.ngettext("car", "cars", 2)).toEqual("cars");
                stonejs.setLocale("en");
                expect(stonejs.ngettext("car", "cars", 0)).toEqual("cars");
                expect(stonejs.ngettext("car", "cars", 1)).toEqual("car");
                expect(stonejs.ngettext("car", "cars", 2)).toEqual("cars");
                stonejs.setLocale("fr");
                expect(stonejs.ngettext("car", "cars", 0)).toEqual("voiture");
                expect(stonejs.ngettext("car", "cars", 1)).toEqual("voiture");
                expect(stonejs.ngettext("car", "cars", 2)).toEqual("voitures");
                stonejs.setLocale("it");
                expect(stonejs.ngettext("car", "cars", 0)).toEqual("macchine");
                expect(stonejs.ngettext("car", "cars", 1)).toEqual("macchina");
                expect(stonejs.ngettext("car", "cars", 2)).toEqual("macchine");
            });
        });
    });

    describe("LazyNString", function () {

        beforeAll(function () {
            stonejs.setLocale("fr");
        });

        beforeEach(function () {
            this.lazy = new stonejs.LazyNString("{n} apple", "{n} apples", 2);
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
            stonejs.setLocale(null);
            expect(stonejs.pgettext("back of an object", "Back")).toEqual("Back");
            expect(stonejs.pgettext("going back/getting out", "Back")).toEqual("Back");
            stonejs.setLocale("xx");
            expect(stonejs.pgettext("back of an object", "Back")).toEqual("Back");
            expect(stonejs.pgettext("going back/getting out", "Back")).toEqual("Back");
            stonejs.setLocale("en");
            expect(stonejs.pgettext("back of an object", "Back")).toEqual("Back");
            expect(stonejs.pgettext("going back/getting out", "Back")).toEqual("Back");
            stonejs.setLocale("fr");
            expect(stonejs.pgettext("back of an object", "Back")).toEqual("Arrière");
            expect(stonejs.pgettext("going back/getting out", "Back")).toEqual("Retour");
            stonejs.setLocale("it");
            expect(stonejs.pgettext("back of an object", "Back")).toEqual("Retro");
            expect(stonejs.pgettext("going back/getting out", "Back")).toEqual("Indietro");

            expect(stonejs.pgettext("back of an object", "Back", "fr")).toEqual("Arrière");

            // context does not match
            stonejs.setLocale(null);
            expect(stonejs.pgettext("body spine", "Back")).toEqual("Back");
            expect(stonejs.pgettext("body spine", "Back", "fr")).toEqual("Back");
        });

        it("can translate strings with replacements", function () {
            stonejs.setLocale(null);
            expect(stonejs.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Go to Paris");
            expect(stonejs.pgettext("infinitive", "Go to {destination}", {destination: "Checkout"})).
                toEqual("Go to Checkout");
            stonejs.setLocale("xx");
            expect(stonejs.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Go to Paris");
            expect(stonejs.pgettext("infinitive", "Go to {destination}", {destination: "Checkout"}))
                .toEqual("Go to Checkout");
            stonejs.setLocale("en");
            expect(stonejs.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Go to Paris");
            expect(stonejs.pgettext("infinitive", "Go to {destination}", {destination: "Checkout"}))
                .toEqual("Go to Checkout");
            stonejs.setLocale("fr");
            expect(stonejs.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Allez à Paris");
            expect(stonejs.pgettext(
                "infinitive",
                "Go to {destination}",
                {destination: "l'interface de paiement"}
            )).toEqual("Aller à l'interface de paiement");
            stonejs.setLocale("it");
            expect(stonejs.pgettext("imperative", "Go to {destination}", {destination: "Paris"}))
                .toEqual("Vai a Paris");
            expect(stonejs.pgettext(
                "infinitive",
                "Go to {destination}",
                {destination: "pagina di pagamento"}
            )).toEqual("Andare a pagina di pagamento");

            expect(stonejs.pgettext("imperative", "Go to {destination}", {destination: "Paris"}, "fr"))
                .toEqual("Allez à Paris");
            expect(stonejs.pgettext(
                "infinitive",
                "Go to {destination}",
                {destination: "l'interface de paiement"},
                "fr"
            )).toEqual("Aller à l'interface de paiement");
        });
    });

    describe("lazyPgettext", function () {

        it("can translate strings", function () {
            var s = stonejs.lazyPgettext("back of an object", "Back");
            stonejs.setLocale(null);
            expect(String(s)).toEqual("Back");
            stonejs.setLocale("fr");
            expect(String(s)).toEqual("Arrière");
        });

        it("can translate strings with replacements", function () {
            var s = stonejs.lazyPgettext("imperative", "Go to {destination}", {destination: "John's house"});
            stonejs.setLocale(null);
            expect(String(s)).toEqual("Go to John's house");
            stonejs.setLocale("fr");
            expect(String(s)).toEqual("Allez à John's house");
        });

    });

    describe("LazyPString", function () {

        beforeAll(function () {
            stonejs.setLocale("fr");
        });

        beforeEach(function () {
            this.lazy = new stonejs.LazyPString("back of an object", "Back");
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
            stonejs.setLocale(null);
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            stonejs.setLocale("xx");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            stonejs.setLocale("en");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strings");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 string");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strings");
            stonejs.setLocale("fr");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 instrument à cordes");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 instrument à cordes");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 instruments à cordes");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 chaîne de caractères");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 chaîne de caractères");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 chaînes de caractères");
            stonejs.setLocale("it");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 strumenti a corda");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 strumento a corda");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 strumenti a corda");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 0, {n: 0}))
                .toEqual("0 stringhe");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 1, {n: 1}))
                .toEqual("1 stringa");
            expect(stonejs.npgettext("computer variable", "{n} string", "{n} strings", 2, {n: 2}))
                .toEqual("2 stringhe");

            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 0, {n: 0}, "fr"))
                .toEqual("0 instrument à cordes");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 1, {n: 1}, "fr"))
                .toEqual("1 instrument à cordes");
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 2, {n: 2}, "fr"))
                .toEqual("2 instruments à cordes");

            // implicit number
            expect(stonejs.npgettext("musical instrument", "{n} string", "{n} strings", 0, "fr"))
                .toEqual("0 instrument à cordes");

            // context does not match
            stonejs.setLocale(null);
            expect(stonejs.npgettext(
                "tool made of lots of textile filaments",
                "{n} string",
                "{n} strings",
                0,
                {n: 0}
            )).toEqual("0 strings");
            expect(stonejs.npgettext(
                "tool made of lots of textile filaments",
                "{n} string",
                "{n} strings",
                0,
                {n: 0},
                "fr"
            )).toEqual("0 strings");
        });

        it("can translate strings", function () {
            stonejs.setLocale(null);
            expect(stonejs.npgettext("computer file", "File", "Files", 0)).toEqual("Files");
            expect(stonejs.npgettext("computer file", "File", "Files", 1)).toEqual("File");
            expect(stonejs.npgettext("computer file", "File", "Files", 2)).toEqual("Files");
            stonejs.setLocale("xx");
            expect(stonejs.npgettext("computer file", "File", "Files", 0)).toEqual("Files");
            expect(stonejs.npgettext("computer file", "File", "Files", 1)).toEqual("File");
            expect(stonejs.npgettext("computer file", "File", "Files", 2)).toEqual("Files");
            stonejs.setLocale("en");
            expect(stonejs.npgettext("computer file", "File", "Files", 0)).toEqual("Files");
            expect(stonejs.npgettext("computer file", "File", "Files", 1)).toEqual("File");
            expect(stonejs.npgettext("computer file", "File", "Files", 2)).toEqual("Files");
            stonejs.setLocale("fr");
            expect(stonejs.npgettext("computer file", "File", "Files", 0)).toEqual("Fichier");
            expect(stonejs.npgettext("computer file", "File", "Files", 1)).toEqual("Fichier");
            expect(stonejs.npgettext("computer file", "File", "Files", 2)).toEqual("Fichiers");
            stonejs.setLocale("it");
            expect(stonejs.npgettext("computer file", "File", "Files", 0)).toEqual("File");
            expect(stonejs.npgettext("computer file", "File", "Files", 1)).toEqual("File");
            expect(stonejs.npgettext("computer file", "File", "Files", 2)).toEqual("File");

            expect(stonejs.npgettext("computer file", "File", "Files", 0, "fr")).toEqual("Fichier");
            expect(stonejs.npgettext("computer file", "File", "Files", 1, "fr")).toEqual("Fichier");
            expect(stonejs.npgettext("computer file", "File", "Files", 2, "fr")).toEqual("Fichiers");
        });
    });

    describe("lazyNpgettext", function () {

        it("can translate strings", function () {
            var s = stonejs.lazyNpgettext("computer file", "File", "Files", 1);
            stonejs.setLocale(null);
            expect(String(s)).toEqual("File");
            stonejs.setLocale("fr");
            expect(String(s)).toEqual("Fichier");
        });

        it("can translate strings with replacements", function () {
            var s = stonejs.lazyNpgettext("musical instrument", "{n} string", "{n} strings", 0);
            stonejs.setLocale(null);
            expect(String(s)).toEqual("0 strings");
            stonejs.setLocale("fr");
            expect(String(s)).toEqual("0 instrument à cordes");
        });
    });

    describe("LazyNPString", function () {
        beforeAll(function () {
            stonejs.setLocale("fr");
        });

        beforeEach(function () {
            this.lazy = new stonejs.LazyNPString("musical instrument", "{n} string", "{n} strings", 2);
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
            stonejs.clearCatalogs();
            stonejs.addCatalogs({
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

            stonejs.addCatalogs({
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
            stonejs.setLocale("fr");
            expect(stonejs.gettext("Hello")).toEqual("Salut");
            expect(stonejs.gettext("World")).toEqual("Monde");

            stonejs.setLocale("it");
            expect(stonejs.gettext("Hello")).toEqual("Buongiorno");

            stonejs.setLocale("en");
            expect(stonejs.gettext("Hello")).toEqual("Hi");
        });

    });

});
