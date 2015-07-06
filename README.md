# Stone.js: Javascript i18n Library


## Quick Start

### 1. Internationalize the application

First import the library, add catalogs and create an alias for the gettext function:

```html
<script src="dist/stonejs.js"></script>
<script>
    // Alias the gettext function
    window._ = Stone.gettext;
    // Add Catalogs (we will see later how to generate the catalogs)
    Stone.addCatalogs({
        en: {"Hello World": "Hello World"},
        fr: {"Hello World": "Bonjour le monde"},
        it: {"Hello World": "Buongiorno il mondo"}
    });
    // Set the current locale
    Stone.setLocale("fr");
</script>
```

Then you must mark all translatable strings of you application:

```javascript
//   -- tranform: --
var myString = "Hello World";
//   -- to: --
var myString = _("Hello World");
```


### 2. Extract all the strings of your application

To extract the strings from your application, Stone.js comes with a script that does the job for you:

```bash
./stone.sh extract js/ --output=locales/
```

This command will create a `catalog.pot` in the `locales` folder.


### 3. Translate your application

To start translating, just copy the `catalog.pot` file and rename it `<lang>.po`:

```bash
cp locales/catalog.pot locales/fr.po
```

You can now translate your application in the `.po` file.


### 4. Build the translations

Once all the `.po` files translated, you can build them into JSON files:

```bash
./stone.sh build locales/
```

This command create a JSON for each locales (`.po` files). You can assemble the JSONs in a single JSON or Javascript file:

```bash
./stone.sh merge locales/ --output=js/translations.js --format=js
```

If you merged the files into a single Javascript, you can modify the script we saw at the first step:

```html
<script src="js/lib/stone.js"></script>
<script src="js/translations.js"></script>
<script>
    window._ = Stone.gettext;
    Stone.setLocale("fr");
</script>
```


## DOM translation

Stone.js can also translate strings stored in the DOM.


### 1. Mark all translatable parts

```html
<span stonejs>Hello World</span>
```

### 2. Allow Stone.js to scan the DOM
```javascript
Stone.enableDomScan(true);
```

That's all
