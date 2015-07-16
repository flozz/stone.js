# Stone.js: Javascript i18n Library

[ ![Build Status](https://api.travis-ci.org/flozz/stone.js.svg?branch=master) ](https://travis-ci.org/flozz/stone.js)
[ ![NPM Version](http://img.shields.io/npm/v/stonejs.svg?style=flat) ](https://www.npmjs.com/package/stonejs)
[ ![License](http://img.shields.io/npm/l/stonejs.svg?style=flat) ](https://www.npmjs.com/package/stonejs)


Stone.js is a gettext-like Javascript internationalization library that provides many useful functionalities like:

* immediate translation with (gettext)
* differed translation using lazy strings (lazyGettext)
* Javascript **and** HTML internationalization
* replacement support inside translated strings
* ~~plural forms support (ngettext/nLazyGettext)~~ *soon*
* tools to extract/update/build translatable strings (see [stonejs-tools][])


## Getting Started


### Getting Stone.js

#### Standalone Version

TODO

#### NPM and Browserify

TODO


### Internationalize Your Application

#### Internationalize Javascript

TODO

#### Internationalize HTML

TODO

#### Extract/Translate/Build Translatable Strings

TODO

#### Loading Catalogs / Enable Translation of your application

TODO js vs json format

TODO


## API


### Stone.gettext

Translates the given string to the current language.

    String: Stone.gettext( <string> [, replacements] );

**params:**

* `string`: The string to translate.
* `replacements`: an object containing replacements for the string (optional, see example below).

**returns:**

The translated string.

**Examples:**

    var text1 = Stone.gettext("Hello World");
    var text2 = Stone.gettext("Hello {name}", {name: "John"});


### Stone.lazyGettext

Same as `Stone.gettext` but returns a `Stone.LazyString` instead of a `String`.

    String: Stone.lazyGettext( <string> [, replacements] );


### Stone.addCatalogs

Add one (or more if you merged multiple language into one file) string catalog.

    Stone.addCatalogs( <catalogs> );

**params:**

* `catalogs`: An object containing translated strings (catalogs can be build using [stronejs-tools][]).

**Examples:**

    Stone.addCatalogs(catalogs);


### Stone.getLocale

Returns the current locale (aka target language for the `gettext` and `lazyGettext` functions). The default locale is "c" (it means no translation: simply returns the string as it is in the source).

    String: Stone.getLocale();

**Examples:**

    var locale = Stone.getLocale();
    // "c", "en", "fr", ...


### Stone.setLocale

Defines the current locale (aka the target language for the `gettext` and `lazyGettext` functions).

    Stone.setLocale( <locale> );

**params:**

* `locale`: The locale code (e.g. `en`, `fr`, ...)

**Examples:**

    Stone.setLocale("fr");


### Stone.guessUserLanguage

Try to guess the user language (based on the browser preferred languages).

    String: Stone.guessUserLanguage();

**returns:**

The user's language.

**example:**

    var locale = Stone.guessUserLanguage();


### Stone.enableDomScan

Allows Stone.js to scan all the DOM to find translatable strings (and to translate them).

    Stone.enableDomScan( <enable> );

**params:**

* `enable`: Enable the can of the DOM if `true`, disable it else.

**example:**

    Stone.enableDomScan(true);


### Stone.updateDomTranslation

Actualize the DOM translation if DOM scan enabled width `Stone.enableDomScan` (re-scan and re-translate all strings).

    Stone.updateDomTranslation();


### Stone.LazyString (class)

`Stone.LazyString` is an object returned by the `Stone.lazyGettext` function. It behaves like a standard `String` object (same API) but its value changes if you change the locale with `Stone.setLocale` function.

This is useful when you have to define translatable strings before the string catalog was loaded, or to re-translate automatically strings each time the locale is changed.

You can find an example of its utilisation in the PhotonUI documentation:

* http://wanadev.github.io/PhotonUI/doc/widgets/translation.html


### "stonejs-locale-changed" (event)

This event is fired each time the locale changes (using the `Stone.setLocale` function).


## Example Catalogs (JSON)

    {
        "fr": {
            "plural-forms": "nplurals=2; plural=(n > 1);",
            "messages": {
                "Hello World": ["Bonjour le monde"],
                "Hello {name}": ["Bonjour {name}"]
            }
        },
        "it": {
            "plural-forms": "nplurals=2; plural=(n != 1);",
            "messages": {
                "Hello World": ["Buongiorno il mondo"],
                "Hello {name}": ["Buongiorno {name}"]
            }
        }
    }


## Changelog

* **2.0.0**:
    * new javascript tools to replace the old pythonic ones
    * new file format (incompatible with old version!) to be ready for plural (ngettext) support



[stonejs-tools]: https://github.com/flozz/stonejs-tools
