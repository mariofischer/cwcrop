CwCrop
===========

This is a mootools plugin to select a part of an image to crop it (or whatever).
It provides a draggable and resizable layer above an image and a "crop"-button, which writes the coordinates of the selection to form fields.

![Screenshot](http://www.chipwreck.de/blog/wp-content/uploads/2009/10/cwcrop-screenshot.png)

How to use
----------

### Requires

* [MooTools More 1.2.4](http://mootools.net/more): Drag.* (and its dependences)


If you use the default settings, the HTML-code below can simply be used (except filename and sizes of course):

- A div-structure where the image is present two times as background image
- Width and Height are set once
- A Form to capture the resulting rectangle dimensions (x,y and w,h)
- The method ch.doCrop() writes the dimensions to the form fields

	#JS
	var ch = new CwCrop();

	#HTML	
	<div id="imgouter">

		<div id="cropframe" style="background-image: url('crop-orig.jpg')">
				<div id="draghandle"></div>
				<div id="resizeHandleXY" class="resizeHandle"></div>
				<div id="cropinfo" rel="Click to crop">
					<div title="Click to crop" id="cropbtn"></div>
					<div id="cropdims"></div>
				</div>
			</div>
		
		<div id="imglayer" style="width: 200px; height: 192px; background-image: url('crop-orig.jpg')">
		</div>
	</div>

	<div id="formset">

		<form name="crop" method="post" action="crop_test.php">
			<p>
				<button onclick="ch.doCrop()">Crop</button>
			</p>

			<input type="hidden" name="crop[x]" value="0" />
			<input type="hidden" name="crop[y]" value="0" />
			<input type="hidden" name="crop[w]" value="0" />
			<input type="hidden" name="crop[h]" value="0" />
		</form>
		
	</div>


Some things are not yet configurable (the form fields for example), this will happen in the next release.

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
