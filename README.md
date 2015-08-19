# Helpful-Code-Stuffs
[ adam m pere ]
[ august 2015 ]

A handfull of helpful codes stuffs (snippets and explanations) to make starting a project easier.

## Dependencies
1. I prefer to use [codekit](https://incident57.com/codekit/) to compile `Sass` and `Jade` files. If you prefer a commandline approach, I recommend [gulp](http://gulpjs.com/).
2. [Compass](http://compass-style.org/) -- This configures the Sass directories and adds many useful functions
3. Sass
4. Jade
5. d3.js
6. Jquery

## Structure 
This directory is extremely organized... for some, it may be a bit too organized but I believe that breaking everything up this way will make it easier for the client to understand our code (not to mention make it that much quicker to understand our own code.

### Jade
An `_` at the beginning of a file name denotes a template or module that should not be rendered by itself. All `Jade` files are in the `/jade` directory. This folder should not be included when uploading for distribution. It is only for development. Jade file compile into the root directory e.g. `/jade` --> `root` but `/jade/about` --> `root/about`

1. `/modules` - This directory should include any content specific partials. Most of the time, these will extend a template.
2. `/partials` - This directory should include any chunks that can be included on more than one page. These are generally content agnostic (like a template) but are included in either a template or a page. (e.g. header, footer, navbar)
3. `/templates` - This directory includes any chunks that are aware of the type of content that they can contain but not the specific content. For example, you might have a chart template that you use to create chart modules.
4. `_layout.jade` - This is the master template for most pages (including the index). This is not in the `/templates` directory simply because it is a file that you may reference often and I want to stress its importance.
5. `index.jade`, `/about`, `/d3`, `...` - Every other folder/file in `/jade` should contain the file that actually compiles into html. Usually this will extend `_layout` and will most likely include partials or modules. These pages are content specific and this is where you define the content in each block (that exists in everything it extends or includes)

### Sass
An `_` at the beginning of a file name denotes a partial. This will not compile into its own `.css` file. All `Sass` files are located in the `/sass` directory. YOU SHOULD BE WRITING YOUR STYLES FOR MOBILE FIRST, DESKTOP SECOND.

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

