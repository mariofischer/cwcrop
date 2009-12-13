CwCrop
===========

This is a mootools plugin to select a part of an image to crop it (or whatever).
It provides a draggable and resizable layer above an image (showing the current dimensions, optionally) and a "crop"-button, which delivers the coordinates of the selection.

![Screenshot](http://www.chipwreck.de/blog/wp-content/uploads/2009/10/cwcrop-screenshot.png)

### Demo

[http://www.chipwreck.de/blog/software/cwcrop/](http://www.chipwreck.de/blog/software/cwcrop/)

### Docs
[http://www.chipwreck.de/blog/software/cwcrop/help/](http://www.chipwreck.de/blog/software/cwcrop/help/)

How to use
----------

### Requires

* [MooTools More 1.2.3](http://mootools.net/more): Drag.* (and its dependences)

If you use the default settings, the HTML-code found in /Demo/ can simply be used (except filename and sizes of course):

- A div-structure where the image is present two times as background image
- Width and Height are set once
- Here a form is prepared to capture the resulting rectangle dimensions (x,y and w,h)
- The method ch.doCrop() triggers the onCrop event, which writes the dimensions to the form fields

	#JS
	
		var ch = new CwCrop({
			onCrop: function(values) {
				console.log("crop top left: "+values.x+","+values.y);
				console.log("crop width height: "+values.w+"x"+values.h);
				
				document.forms["crop"].elements["crop[x]"].value = values.x;
				document.forms["crop"].elements["crop[y]"].value = values.y;
				document.forms["crop"].elements["crop[w]"].value = values.w;
				document.forms["crop"].elements["crop[h]"].value = values.h;

				// document.forms["crop"].submit();

			}
		});
		
(See appropriate files in /Demo/ or [http://www.chipwreck.de/blog/software/cwcrop/help/](http://www.chipwreck.de/blog/software/cwcrop/help/) for more information)
	
	
Options
----------

minsize: {x: 60, y: 60}				- the minimal size of the rectangle (user can not make it smaller)

maxsize: {x: 200, y: 200} 			- the maximal size of the rectangle (user can not make it bigger)

initialposition: {x: 10, y: 10} 	- the initial position of the crop area

maxratio: {x: 2, y: 2} 				- the maximum ratio for x and y

originalsize: {x: 1, y: 1} 			- the ratio of the originalimage vs. the shown image (for example: you crop a thumbnail, but apply the cropping to a much bigger image)

initialmax: false 					- extend the selection rectangle to the maximum size initially

classactive: "active" 				- name of the class which is applied to the cropframe if the user selects it ("active" state..)
		
cropframe: "cropframe" 				- id of the outer div

imgframe: "imglayer" 				- id of the layer div

cropdims: "cropdims" 				- id of the div which shows the current dimension (if empty, dimension is not shown)

cropbtn: "cropbtn" 					- id of a div (or something else), which trigger the cropping

draghandle: "draghandle" 			- id of the div of the drag-handle

resizehandle: "resizeHandleXY" 		- id of the div of the resize-handle

Events
----------

onCrop								- Triggered if the user clicks "crop" or if doCrop() is called. The argument is this object: {'x': xposition, 'y': yposition, 'w': width, 'h': height}
