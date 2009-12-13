CwCrop
===========

This is a mootools plugin to select a part of an image to crop it (or whatever).
It provides a draggable and resizable layer above an image and a "crop"-button, which writes the coordinates of the selection to form fields.

![Screenshot](http://www.chipwreck.de/blog/wp-content/uploads/2009/10/cwcrop-screenshot.png)

### Demo

[http://www.chipwreck.de/cwcrop/crop_test.php](http://www.chipwreck.de/cwcrop/crop_test.php)

How to use
----------

### Requires

* [MooTools More 1.2.4](http://mootools.net/more): Drag.* (and its dependences)

If you use the default settings, the HTML-code below can simply be used (except filename and sizes of course):

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
	
	#CSS
	
	\#imgouter \{
		position: relative; border: none; margin-left: 10px; z-index: 200;
	\}
	\#imglayer \{
		background-color: transparent; background-repeat: no-repeat; opacity: 0.5; z-index: 300; cursor: default;
		filter:alpha(opacity=50); /* IE 6-7 Trash */
		-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)"; /* IE8 Trash */		
	\}	
	\#cropframe \{
		width: 40px; height: 40px; left: 0px; top: 0px;	border: 1px dashed #333333; position: absolute;	z-index: 999; padding: 0px;	background-repeat: no-repeat;
		-border-image: url('ants.gif') 1 repeat repeat;	-webkit-border-image: url('ants.gif') 1 repeat repeat; -moz-border-image: url('ants.gif') 1 repeat repeat;		
	\}
	\#cropframe.active \{
		border: 1px dashed #ffffff;
	\}
	\#cropinfo \{
		background-color: #cccccc;	opacity: 0.4; top: 0px; left: 0px; height: 32px; position: absolute; z-index: 600;
		filter:alpha(opacity=40); /* IE 6-7 Trash */
		-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=40)"; /* IE8 Trash */		
	\}
	\#cropdims \{
		color: #000000; padding: 6px 5px; margin-left: 32px; font-size: 13px; z-index: 500;
	\}
	\#cropbtn \{
		background-image:url('crop.gif'); background-repeat: no-repeat;	position: absolute;	left: 0px; height: 32px; width: 32px; cursor: pointer !important; z-index: 800;
	\}
	\#cropbtn:hover \{
		background-color: black;
	\}
	\#draghandle \{
		background-color: transparent; top: 0; left: 0; width: 100%; height: 100%; margin: 0px; position: absolute;	z-index: 90; cursor: move;
	\}
	.resizeHandle \{
		z-index: 40; opacity: 0.9; background-color: #666666; position: absolute; margin: 0px;	border: 1px solid #ffffff; height: 8px;	width: 8px;
		filter:alpha(opacity=90); /* IE 6-7 Trash */
		-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=90)"; /* IE8 Trash */
	\}
	\#resizeHandleXY \{
		left: 100%;	top: 100%; cursor: se-resize;
	\}


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
