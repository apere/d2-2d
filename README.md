# Helpful-Code-Stuffs
[ adam m pere ]
[ august 2015 ]

A handfull of helpful codes stuffs (snippets and explanations) to make starting a project easier.

## Dependencies
1. I prefer to use [codekit](https://incident57.com/codekit/) to compile `Sass` and `Jade` files. If you prefer a commandline approach, I recommend [gulp](http://gulpjs.com/).
2. [Compass](http://compass-style.org/) -- This configures the Sass directories and adds many useful functions
3. Sass -- This compiles into our `css` file
4. Jade -- This is a templating engine that compiles into our actual `html` files.
5. d3.js -- This is a javascript library that is used to make interactive graphics and charts
6. Jquery -- Hopefully I don't need to introduce this.

## Structure 
This directory is extremely organized... for some, it may be a bit too organized but I believe that breaking everything up this way will make it easier for the client to understand our code (not to mention make it that much quicker to understand our own code.

### Config Files

1. `config.rb` - This file is used to configure compass and define the directories where the `Sass` files will be compiled from and to.
2. `config.codekit` - This is a configuration file for codekit that is set up to compile javascript, Jade, and Sass files and vendor prefixes to styles automatically.

### Assets
Assets is where you should place all your non-html files.

1. `/css/all` - This directory is where all of the css will be compiled to. You should never have to do anything to this directory.
2. `imgs` - This is the directory where all images should be held.
3. `imgs/icons` - This is the directory where all icons should be contained.
4. `imgs/icons/icons.svg` - This is an svg spritesheet (pulled from the Partners Healthcare Insight project). We use a spritesheet instead of pasting the svg code over and over again because it's quicker to type AND it is much less resource intensive on the user because the browser can cache the spritesheet and refrence individual elements instead of having to load each svg everytime.

example icon:

```svg
<symbol id="icon-activities" width = "13px" height = "13px" viewBox="0 0 13 13">
  <path d="M5.826,9.926 C5.826,9.926 5.826,8.938 5.826,8.938 C5.826,8.938 12.814,8.938 12.814,8.938 C12.814,8.938 12.814,9.926 12.814,9.926 C12.814,9.926 5.826,9.926 5.826,9.926 ZM7.841,5.939 C7.841,5.939 12.814,5.939 12.814,5.939 C12.814,5.939 12.814,6.927 12.814,6.927 C12.814,6.927 7.841,6.927 7.841,6.927 C7.841,6.927 7.841,5.939 7.841,5.939 ZM5.840,3.003 C5.840,3.003 12.814,3.003 12.814,3.003 C12.814,3.003 12.814,3.960 12.814,3.960 C12.814,3.960 5.840,3.960 5.840,3.960 C5.840,3.960 5.840,3.003 5.840,3.003 ZM5.840,0.003 C5.840,0.003 12.814,0.003 12.814,0.003 C12.814,0.003 12.814,0.960 12.814,0.960 C12.814,0.960 5.840,0.960 5.840,0.960 C5.840,0.960 5.840,0.003 5.840,0.003 ZM6.954,6.385 C5.008,8.176 3.413,10.696 2.910,11.986 C2.910,11.986 -0.015,8.886 -0.015,8.886 C-0.015,8.886 0.732,8.377 0.732,8.377 C0.732,8.377 2.425,9.672 2.425,9.672 C3.116,8.849 4.655,6.615 6.775,5.315 C6.775,5.315 6.954,6.385 6.954,6.385 ZM1.802,3.003 C1.802,3.003 3.676,3.003 3.676,3.003 C3.676,3.003 3.676,3.960 3.676,3.960 C3.676,3.960 1.802,3.960 1.802,3.960 C1.802,3.960 1.802,3.003 1.802,3.003 ZM1.802,0.003 C1.802,0.003 3.676,0.003 3.676,0.003 C3.676,0.003 3.676,0.960 3.676,0.960 C3.676,0.960 1.802,0.960 1.802,0.960 C1.802,0.960 1.802,0.003 1.802,0.003 Z" id="path-1" class="cls-2" fill-rule="evenodd"/>
</symbol>
```
Each icon should be wrapped in a `symbol` element with a unique id, a width, a height, and a viewbox (which usually determines the width and height).

To use the icon, you would do something like

```html
<svg class="icon">
  <use xlink:href="<%= basepath %>/imgs/icons/icons.svg#icon-activities" />
</svg>
```
Where you simply append the id of your icon at the end of the `xlink:href` attr (which should be the url of your spritesheet).

### Jade
An `_` at the beginning of a file name denotes a template or module that should not be rendered by itself. All `Jade` files are in the `/jade` directory. This directory should not be included when uploading for distribution. It is only for development. Jade file compile into the root directory e.g. `/jade` --> `root` but `/jade/about` --> `root/about`

1. `/modules` - This directory should include any content specific partials. Most of the time, these will extend a template.
2. `/partials` - This directory should include any chunks that can be included on more than one page. These are generally content agnostic (like a template) but are included in either a template or a page. (e.g. header, footer, navbar)
3. `/templates` - This directory includes any chunks that are aware of the type of content that they can contain but not the specific content. For example, you might have a chart template that you use to create chart modules.
4. `_layout.jade` - This is the master template for most pages (including the index). This is not in the `/templates` directory simply because it is a file that you may reference often and I want to stress its importance.
5. `index.jade`, `/about`, `/d3`, `...` - Every other directory/file in `/jade` should contain the file that actually compiles into html. Usually this will extend `_layout` and will most likely include partials or modules. These pages are content specific and this is where you define the content in each block (that exists in everything it extends or includes)

### Sass
An `_` at the beginning of a file name denotes a partial. This will not compile into its own `.css` file. All `Sass` files are located in the `/sass` directory. This directory should not be included when uploadng for distribution.

YOU SHOULD BE WRITING YOUR STYLES FOR MOBILE FIRST, DESKTOP SECOND.

1. `all/all.scss` - Only `.scss` files in the `all` directory will be compiled into a css file. For the most part, `all.css` is the only file that will be compiled. This file is simply a list of includes for everything at the first level of the `/partials` directory. If you add a file to the first level of `/partials` then you must include it in `all.scss`.
2. `/partials` - This is the directory where you'll be spending most of your time. It contains all the `.scss` partial files that compile into `all.scss`. 
3. `/partials/_charts.scss` - This file contains no actual styles, it simply includes all files from `/partials/charts`.
4. `/partials/charts` - This directory contains all the individual `.scss` files for each chart type.
5. `/partials/_desktop.scss` - This file includes everything in the `/partials/desktop` directory and wraps it in a media query. This allows you to break up the styles for desktop and mobile.
6. `/partials/desktop` - This directory contains all the `.scss` files for larger screen sizes. This directory should mimic `/partials` (omitting a few files / directories)
7. `/partials/_fonts.scss` - This is where you define any fonts if you have the source files
8. `/partials/_forms.scss` - This file contains no acutal styles, it simply includes all files from `/partials/forms`.
9. `/partials/forms` - This directory contains all files associate with form elements.
10. `/partials/_icons.scss` - This file is where you should define all icon classes and do perform icon styling.
11. `/partials/_media.scss` - This file is where you do all styling for any type of media: images, audio, video, etc.
12. `/partials/_structure.scss` - This file should have no actual styles. It simply includes all files in `/partials/structures`.
13. `/partials/structures` - This directory contains all files that directly relate to the layout of the page. This includes: the footer, header, lists, navigation menus, tables, and others.
14. `/partials/_typography.scss` - This file contains all styles that directly relate to type and not structure. This includes font sizes, line heights, font colors, blockquotes, paragraphs, etc.
15. `/partials/_variables.scss` - This file does not contain any actual styles. It simply includes all files in `/partials/variables`.
16. `/partials/variables` - This directory includes files that contain every `Sass` variable that will be used in this project. That also includes helper classes that you may want to extend over and over again (e.g. transitions).

### JavaScript
All javascript files are located in `/assets/js`. All javascript files are compiled on save to `/min` in the same directory.

1. `all.js` - This file is to be included on every page. This is where you put global functions such as window resizing, etc.
2. `/charts` - This directory is where the javascript files for individual charts are held. Each chart has one function that can be called to place the chart in a DOM element.
3. `/sections` - This directory is where you will put all screen specific javascript.
4. `/vendor` - This directory is where all javascript libraries (such as jquery or d3.js) are contained.

