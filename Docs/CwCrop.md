Class: CwCrop {#CwCrop}
=======================



### Implements:

Options




CwCrop Method: constructor {#CwCrop:constructor}
-------------------------------------------------

### Notes:


- Visit [http://www.chipwreck.de/blog/software](http://www.chipwreck.de/blog/software) for more information.


### Syntax:

	var myCwCrop = new CwCrop(options);

### Arguments:

1. options - (*object*, optional) Initial options for the class.

### Options:

* minsize - (**) the minimal size of the rectangle (user can not make it smaller)
* y - (**)
* maxsize - (**) the maximal size of the rectangle (user can not make it bigger)
* initialposition - (**) the initial position of the crop area
* maxratio - (**) the maximum ratio for x and y
* originalsize - (**) the ratio of the originalimage vs. the shown image (for example: you crop a thumbnail, but apply the cropping to a much bigger image)
* initialmax - (**) extend the selection rectangle to the maximum size initially
* classactive - (**) name of the class which is applied to the cropframe if the user selects it ("active" state..)
* cropframe - (**) id of the outer div
* imgframe - (**) id of the layer div
* cropdims - (**) id of the div which shows the current dimension (if empty, dimension is not shown)
* cropbtn - (**) id of a div (or something else), which trigger the cropping
* draghandle - (**) id of the div of the drag-handle
* resizehandle - (**) id of the div of the resize-handle

### Returns:

* (*object*) A new *CwCrop* instance.



CwCrop Method: onStart {#CwCrop:onStart}
-----------------------------------------


### Syntax:



### Arguments:

1. el - (**)


CwCrop Method: onDrag {#CwCrop:onDrag}
---------------------------------------


### Syntax:



### Arguments:

1. el - (**)
2. event - (**)


CwCrop Method: onComplete {#CwCrop:onComplete}
-----------------------------------------------


### Syntax:



### Arguments:

1. el - (**)


CwCrop Method: checkRatio {#CwCrop:checkRatio}
-----------------------------------------------


### Syntax:



### Arguments:

1. el - (**)
2. event - (**)


CwCrop Method: recalcResize {#CwCrop:recalcResize}
---------------------------------------------------


### Syntax:



### Arguments:

1. el - (**)


CwCrop Method: updateCropDims {#CwCrop:updateCropDims}
-------------------------------------------------------


### Syntax:



### Arguments:

1. el - (**)
2. displayPosition - (**)

### Returns:





CwCrop Method: doCrop {#CwCrop:doCrop}
---------------------------------------

Writes the rectangle dimensions to the form fields and submits the form

### Syntax:

	myCwCrop.doCrop();

