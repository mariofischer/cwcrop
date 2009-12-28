CwCrop
===========

This is a mootools plugin to select a part of an image to crop it (or whatever).
It provides a draggable and resizable layer above an image (showing the current dimensions, optionally) and a "crop"-button, which delivers the coordinates of the selection.

![Screenshot](http://www.chipwreck.de/blog/wp-content/uploads/2009/10/cwcrop-screenshot.png)

### Demo

[http://www.chipwreck.de/blog/software/cwcrop/cwcrop-demo/](http://www.chipwreck.de/blog/software/cwcrop/cwcrop-demo/)

### Docs
[http://www.chipwreck.de/blog/software/cwcrop/help/](http://www.chipwreck.de/blog/software/cwcrop/help/)

How to use
----------

### Requires

* [MooTools More 1.2.3](http://mootools.net/more): Drag.* (and its dependencies)

If you use the default settings, the HTML-code found in /Demo/ can simply be used (except filename and sizes of course):

- A div-structure where the image is present two times as background image.
- Width and Height are set once.
- Here a form is prepared to capture the resulting rectangle dimensions: x,y and w,h.
- The method ch.doCrop triggers the onCrop event, which writes the dimensions to the form fields and submits it.

#JS
	var ch = new CwCrop({
		onCrop: function(values) {
			document.forms["crop"].elements["crop[x]"].value = values.x;
			document.forms["crop"].elements["crop[y]"].value = values.y;
			document.forms["crop"].elements["crop[w]"].value = values.w;
			document.forms["crop"].elements["crop[h]"].value = values.h;
			document.forms["crop"].submit();
		},
		maxratio: {x: 2, y: 1},
		fixedratio: false
	});
	

### More Information

See [http://www.chipwreck.de/blog/software/cwcrop/help/](http://www.chipwreck.de/blog/software/cwcrop/help/) for more information.
	