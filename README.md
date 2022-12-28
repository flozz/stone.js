# Stone.js: JavaScript i18n Library

[![Lint and test](https://github.com/flozz/stone.js/actions/workflows/tests.yml/badge.svg)](https://github.com/flozz/stone.js/actions/workflows/tests.yml)
[![NPM Version](http://img.shields.io/npm/v/stonejs.svg?style=flat)](https://www.npmjs.com/package/stonejs)
[![License](http://img.shields.io/npm/l/stonejs.svg?style=flat)](https://github.com/flozz/stone.js/blob/master/LICENSE)
[![Discord](https://img.shields.io/badge/chat-Discord-8c9eff?logo=discord&logoColor=ffffff)](https://discord.gg/P77sWhuSs4)


Stone.js is a client-side gettext-like JavaScript internationalization library that provides many useful functionalities like:

* immediate translation (gettext)

* differed translation using lazy strings (lazyGettext)

* JavaScript **and** HTML internationalization

* replacement support inside translated strings

* plural forms support (ngettext/lazyNgettext)

* tools to extract/update/build translatable strings (see [stonejs-tools][])


## Getting Started


### Getting Stone.js

#### Standalone Version

First download [Stone.js zip][dl-zip] or clone the repository.

Then include the `stonejs.js` or `stonejs.min.js` (from the `dist` folder) in you HTML page, and create an alias for the `Stone.gettext` function:

```html
<script src="dist/stonejs.js"></script>
<script>
    window._ = Stone.gettext;
</script>
```


#### NPM and Browserify

First install the `stonejs` package:

    npm install --save stonejs

Then include it where you need it, and create an alias for the `Stone.gettext` function:

```javascript
// using CommonJS modules

var Stone = require("stonejs");
var _ = Stone.gettext;

// using ES6 modules
import Stone, { gettext as _ } from "stonejs";
```


### Internationalize Your Application

#### Internationalize JavaScript

To internationalize your JavaScript files, you just have to "mark" all translatable strings of your application by passing them to the `gettext` function.

**Example:**

```javascript
// ---- Replace ----

var text = "Hello World";

// --- by ----

var text = _("Hello World");

// NOTE: you can also write Stone.gettext("Hello World")
// if you do not want to create the "_" alias for the gettext function
```

#### Internationalize HTML

To internationalize your HTML files, you just have to add the `stonejs` attribute to all translatable tags.

**Example:**

```html
<!-- replace -->

<div>Hello World</div>

<!-- by -->

<div stonejs>Hello World</div>
```

**NOTE:** To allow Stone.js to translate your DOM, you have to enable DOM scan:

```javascript
Stone.enableDomScan(true);
```


#### Extract/Translate/Build Translatable Strings

Once you have internationalized your application, you will have to:

* Extract the translatable strings from your js and html files,

* Translate the extracted strings,

* Build your translation inside string catalogs.

For all those steps, you can use the Stone.js tools available here:

* https://github.com/flozz/stonejs-tools


#### Load Catalogs / Enable Translation of your application

The last step to display your application into plenty of languages is to load the catalogs you built with [stonejs-tools][] and set the current locale.

**NOTE:** Stone.js Tools can build the catalogs in two formats: `js` and `json`. Be careful if you use the javascript one. You should include the catalog file **after** the stonejs lib is loaded (you should include it after in your HTML file if you are using the standalone version of the lib, and if you use the npm/browserify version, you should include the file **after** the first time you `require` the library).

**Example:**

```html
<script src="dist/stonejs.js"></script>
<script>
    var catalogs = {
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
    };

    window._ = Stone.gettext;       // Alias the Stone.gettext function
    Stone.addCatalogs(catalogs);    // Add catalogs (here it is hard coded for the need of the example
    Stone.enableDomScan(true);      // Allow Stone.js to scan the DOM to find translatable nodes
    Stone.setLocale("fr");          // Sets the locale to french


    console.log(_("Hello World"));
    // Bonjour le monde

    console.log(_("Hello World", "it"));
    // Buongiorno il mondo

    console.log(_("Hello {name}", {name: "John"}));
    // Bonjour John

    console.log(_("Hello {name}", {name: "John"}, "it"));
    // Buongiorno John

    var text = Stone.lazyGettext("Hello World");

    console.log(text.toString());
    // Bonjour le monde

    Stone.setLocale("it");
    console.log(text.toString());
    // Buongiorno il mondo

    Stone.setLocale("c");
    console.log(text.toString());
    // Hello World

    Stone.setLocale("foo");
    console.log(text.toString());
    // Hello World

</script>
```


## API


### Stone.gettext

Translates the given string to the current language.

    String: Stone.gettext( <string> [, locale] );
    String: Stone.gettext( <string> [, replacements] [, locale] );

**params:**

* `string`: The string to translate.
* `locale`: The locale string to use for translation (optional, default: current locale).
* `replacements`: an object containing replacements for the string (optional, see example below).

**returns:**

The translated string.

**Examples:**

```javascript
var text1 = Stone.gettext("Hello World");
var text1 = Stone.gettext("Hello World", "it");
var text2 = Stone.gettext("Hello {name}", {name: "John"});
var text3 = Stone.gettext("Hello {name}", {name: "John"}, "it");
```


### Stone.lazyGettext

Same as `Stone.gettext` but returns a `Stone.LazyString` instead of a `String`.

    String: Stone.lazyGettext( <string> [, locale] );
    String: Stone.lazyGettext( <string> [, replacements] [, locale] );

### Stone.ngettext

Translates the given strings to the current language with plural support.

    String: Stone.ngettext( <string>, <stringPlural>, <number> [, locale] );
    String: Stone.ngettext( <string>, <stringPlural>, <number> [, replacements] [, locale] );

**params:**

* `string`: The string to translate, in English singular form.
* `stringPlural`: The string to translate, in English plural form.
* `number`: The number that determines plural forms
* `locale`: The locale string to use for translation (optional, default: current locale).
* `replacements`: an object containing replacements for the string (optional, see example below).

Note: 'n' is an implicit replacement for given number.

**returns:**

The translated string, in some plural form.

**Examples:**

```javascript
var text1 = Stone.ngettext("one apple", "{nbApples} apples", 3, {nbApples: 3});
var text2 = Stone.ngettext("{n} apple", "{n} apples", 3, {n: 3});
var text3 = Stone.ngettext("{n} apple", "{n} apples", 3); // 'n' is an implicit replacement of given number
```


### Stone.lazyNgettext

Same as `Stone.ngettext` but returns a `Stone.LazyNString` instead of a `String`.


### Stone.pgettext

Translates the given string to the current language using a context argument to solve ambiguities ([read more](https://www.gnu.org/software/gettext/manual/gettext.html#Using-contexts-for-solving-ambiguities)).

    String: Stone.pgettext( <context>, <string> [, locale] );
    String: Stone.pgettext( <context>, <string> [, replacements] [, locale] );

**params:**

* `context`: The context of the string.
* `string`: The string to translate.
* `locale`: The locale string to use for translation (optional, default: current locale).
* `replacements`: an object containing replacements for the string (optional).

**returns:**

The translated string.

**Examples:**

```javascript
var text1 = Stone.pgettext("going back", "Back");
var text1 = Stone.pgettext("back of an object", "Back", "it");
```

### Stone.lazyPgettext

Same as `Stone.pgettext` but returns a `Stone.LazyPString` instead of a `String`.


### Stone.npgettext

Translates the given strings to the current language with plural support and using a context argument to solve ambiguities ([read more](https://www.gnu.org/software/gettext/manual/gettext.html#Using-contexts-for-solving-ambiguities)).

    String: Stone.npgettext( <context>, <string>, <stringPlural>, <number> [, locale] );
    String: Stone.npgettext( <context>, <string>, <stringPlural>, <number> [, replacements] [, locale] );

**params:**

* `context`: The context of the string.
* `string`: The string to translate, in English singular form.
* `stringPlural`: The string to translate, in English plural form.
* `number`: The number that determines plural forms
* `locale`: The locale string to use for translation (optional, default: current locale).
* `replacements`: an object containing replacements for the string (optional, see example below).

Note: 'n' is an implicit replacement for given number.

**returns:**

The translated string, in some plural form.

**Examples:**

```javascript
var text1 = Stone.npgettext("fruit", "one apple", "{nbApples} apples", 3, {nbApples: 3});
var text2 = Stone.npgettext("fruit", "{n} apple", "{n} apples", 3, {n: 3});
var text3 = Stone.npgettext("fruit", "{n} apple", "{n} apples", 3); // 'n' is an implicit replacement of given number
```


### Stone.lazyNpgettext

Same as `Stone.npgettext` but returns a `Stone.LazyNPString` instead of a `String`.


### Stone.addCatalogs

Adds one (or more if you merged multiple languages into one file) string catalog.

    Stone.addCatalogs( <catalogs> );

**params:**

* `catalogs`: An object containing translated strings (catalogs can be built using [stronejs-tools][]).

**Examples:**

```javascript
Stone.addCatalogs(catalogs);
```


### Stone.gettext_noop

Register a string to be translatable.
Do not operate translation.
Translation can be operated later with `Stone.gettext`.
This can be useful in special cases where you want to register a string for translation,
but want to keep a reference of the original string, in order to translate it later.

    String: Stone.gettext_noop( <string> );

**params:**

* `string`: The string to register for translation

**returns:**

The exact same given string

**Examples:**

```javascript
var translatable1 = Stone.gettext_noop("Some string to translate");
var translatable2 = Stone.gettext_noop("Hello {name}");
var text1 = Stone.gettext(translatable1);
var text2 = Stone.gettext(translatable2, { name: "John" });
```


### Stone.getLocale

Returns the current locale (aka target language for the `gettext` and `lazyGettext` functions). The default locale is "c" (it means no translation: simply returns the string as it is in the source).

    String: Stone.getLocale();

**Examples:**

```javascript
var locale = Stone.getLocale();
// "c", "en", "fr", ...
```


### Stone.listCatalogs

Returns all availables catalogs.

    String: Stone.listCatalogs();

**Examples:**

```javascript
var catalogsList = Stone.listCatalogs();
// ["c", "en", "fr", ... ]
```


### Stone.setLocale

Defines the current locale (aka the target language for the `gettext` and `lazyGettext` functions).

**NOTE:** You can use the `setBestMatchingLocale` function to set the best language for the user.

    Stone.setLocale( <locale> );

**params:**

* `locale`: The locale code (e.g. `en`, `fr`, ...)

**Examples:**

```javascript
Stone.setLocale("fr");
```


### Stone.setBestMatchingLocale

Find and set the best language for the user (depending on available catalogs and given language list).

    Stone.setBestMatchingLocale( [locales] );

**params:**

* `locales`: (optional) string or array of string (e.g. `"fr"`, `["fr", "fr_FR", "en_US"]`).

**Examples:**

```javascript
Stone.setBestMatchingLocale();  // Automaticaly set the best language (from informations given by the browser)
setBestMatchingLocale("fr");    // Finds the catalog that best match "fr" ("fr", "fr_FR", fr_*,...)
setBestMatchingLocale(["fr", "en_US", "en_UK"]);    // Finds the best available catalog from the given list
```


### Stone.findBestMatchingLocale

Find and return the given locale that best matches the given catalogs.

    Stone.findBestMatchingLocale( [locales], [catalogs] );

**params:**

* `locales`: string or array of string (e.g. `"fr"`, `["fr", "fr_FR", "en_US"]`).
* `catalogs`: array of string (e.g. `["fr_FR", "en"]`).

**Example:**

```javascript
Stone.findBestMatchingLocale(["fr"], ["pt_BR", "fr_CA", "fr_FR"]);  // -> "fr_FR"
```


### Stone.guessUserLanguage

Tries to guess the user language (based on the browser's preferred languages).

    String: Stone.guessUserLanguage();

**returns:**

The user's language.

**example:**

```javascript
var locale = Stone.guessUserLanguage();
```


### Stone.enableDomScan

Allows Stone.js to scan all the DOM to find translatable strings (and to translate them).

    Stone.enableDomScan( <enable> );

**params:**

* `enable`: Enable the scan of the DOM if `true`, disable it otherwise.

**example:**

```javascript
Stone.enableDomScan(true);
```


### Stone.updateDomTranslation

Updates the DOM translation if DOM scan was enabled with `Stone.enableDomScan` (re-scan and re-translate all strings).

    Stone.updateDomTranslation();


### Stone.LazyString (class)

`Stone.LazyString` is an object returned by the `Stone.lazyGettext` function. It behaves like a standard `String` object (same API) but its value changes if you change the locale with `Stone.setLocale` function.

This is useful when you have to define translatable strings before the string catalog was loaded, or to automatically re-translate strings each time the locale is changed.

You can find an example of its use in the PhotonUI documentation:

* http://wanadev.github.io/PhotonUI/doc/widgets/translation.html


### Stone.LazyNString (class)

Same as `Stone.LazyString`, using `Stone.ngettext` for plural support.


### Stone.LazyPString (class)

Same as `Stone.LazyString`, using `Stone.pgettext` for context support.


### Stone.LazyNPString (class)

Same as `Stone.LazyString`, using `Stone.npgettext` for plural and context support.


### "stonejs-locale-changed" (event)

This event is fired each time the locale changes (using the `Stone.setLocale` function).


## Example Catalogs (JSON)

```javascript
{
    "fr": {
        "plural-forms": "nplurals=2; plural=(n > 1);",
        "messages": {
            "Hello World": {
                "*": ["Bonjour le monde"]
            },
            "Hello {name}": {
                "*": ["Bonjour {name}"]
            }
        }
    },
    "it": {
        "plural-forms": "nplurals=2; plural=(n != 1);",
        "messages": {
            "Hello World": {
                "*": ["Buongiorno il mondo"]
            },
            "Hello {name}": {
                "*": ["Buongiorno {name}"]
            }
        }
    }
}
```


## Support this project

Want to support this project?

* [☕️ Buy me a coffee](https://www.buymeacoffee.com/flozz>)
* [💵️ Give me a tip on PayPal](https://www.paypal.me/0xflozz>)
* [❤️ Sponsor me on GitHub](https://github.com/sponsors/flozz>)



## Changelog

* **[NEXT]** (changes on `master` but not released yet):

  * Nothing yet ;)

* **v2.7.0:**

  * Added support of string with context (`pgettext`, `npgettext`,...) (@Krenodeno, #33, #40)
  * Updated dependencies
  * Dev: tests are now using Jest instead of Jasmine, and Github Actions replaces Travis

* **v2.6.0:**

  * Added support of `ngettext()` for the JS API (thanks @jbghoul, #17)
  * Added support of `gettext_noop()` for the JS API (thanks @jbghoul, #19)

* **v2.5.0:**

  * Allow to override the local for a particular `gettext()` call (thanks @JochLAin, #13)

* **v2.4.0:**

  * Added the `listCatalogs` methods to list available catalogs (thanks @BobRazowsky, #12)

* **v2.3.0**:

  * The `addCatalog` function now merge catalogs.

* **v2.2.0**:

  * New function to find the best matching catalog from given locales and catalogs (`findBestMatchingLocale`)

* **v2.1.0**:

  * Better language code handling (now support locales with dialect like `fr_FR`, `fr_CA`,...)
  * New function to select the best catalog from a language list (`setBestMatchingLocale`)

* **v2.0.0**:

  * New javascript tools to replace the old pythonic ones
  * New file format (incompatible with the previous version!) to be ready for plural forms (ngettext) support
  * New documentation


[stonejs-tools]: https://github.com/flozz/stonejs-tools
[dl-zip]: https://github.com/flozz/stone.js/archive/master.zip
