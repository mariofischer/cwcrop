/*
---
description: CwCrop

authors:
  - Mario Fischer (http://www.chipwreck.de/blog/)

license:
  - MIT-style license

requires:
  core/1.2.3: '*'
  more/1.2.3: 'Drag.*'

provides:
  - CwCrop
  
version:
  0.69
...
*/
CwCrop = new Class({

	Implements: [Options,Events],

	options: {
		minsize: {x: 60, y: 60}, // minimal size of the resulting image
		maxsize: {x: 200, y: 200}, // maximal size of the resulting image
		originalsize: {x: 1, y: 1}, // size of the original image (if the crop area uses a smaller version)

		fixedratio: false, // if set to a number, use this as a fixed ratio (and ignore maxratio)
		maxratio: {x: 2, y: 2}, // maximum ratio x, y

		initialposition: {x: 10, y: 10}, // initial position (in the crop area)
		initialmax: false, // extend the crop area initially to the maximum size

		classactive: "active", // css classname for the crop frame if the user moves/resizes
		cropframe: "cropframe", // css id of the crop frame
		imgframe: "imglayer", // css id of the image frame
		cropdims: "cropdims", // css id for the crop dimensions (leave empty to disable showing dimensions)
		cropbtn: "cropbtn", // css id for an addition button (leave empty to disable)
		draghandle: "draghandle", // css id for the dragging handle
		resizehandle: "resizeHandleXY", // css id for the resizing handle

		onCrop: $empty // function to execute if the user crops
	},

	initialize: function(options)
	{
		this.setOptions(options);

		if (!$(this.options.cropframe) || !$(this.options.imgframe)) {
			return;
		}

		// calc initial limits and scaling
		this.elemsize = $(this.options.imgframe).getSize();
		if (this.elemsize.x == 0) {
			this.elemsize = $(this.options.imgframe).getOffsetParent().getSize();
		}

		this.orig_to_scaled = {x: 1, y: 1};
		if (this.options.originalsize.x > 1 && this.options.originalsize.y > 1) {
			this.orig_to_scaled.x = this.options.originalsize.x / this.elemsize.x;
			this.orig_to_scaled.y = this.options.originalsize.y / this.elemsize.y;
		}

		this.options.maxsize.x = ( this.options.maxsize.x * (1/this.orig_to_scaled.x) ).limit(1, this.elemsize.x-2);
		this.options.maxsize.y = ( this.options.maxsize.y * (1/this.orig_to_scaled.y) ).limit(1, this.elemsize.y-2);
		this.options.minsize.x = ( this.options.minsize.x * (1/this.orig_to_scaled.x) ).limit(1, this.elemsize.x-2);
		this.options.minsize.y = ( this.options.minsize.y * (1/this.orig_to_scaled.y) ).limit(1, this.elemsize.y-2);

		this.limits = {
			x:[this.options.minsize.x, this.options.maxsize.x],
			y:[this.options.minsize.y, this.options.maxsize.y]
		};

		// init crop frame
		if (this.options.initialmax) {
			$(this.options.cropframe).setStyle("top", 0);
			$(this.options.cropframe).setStyle("left", 0);
			$(this.options.cropframe).setStyle("width", this.limits.x[1].toInt());
			$(this.options.cropframe).setStyle("height", this.limits.y[1].toInt());
		}
		else {
			$(this.options.cropframe).setStyle("top", this.options.initialposition.x);
			$(this.options.cropframe).setStyle("left", this.options.initialposition.y);
			$(this.options.cropframe).setStyle("width", this.limits.x[0].toInt());
			$(this.options.cropframe).setStyle("height", this.limits.y[0].toInt());
		}
		if (this.options.fixedratio) {
			$(this.options.cropframe).setStyle("width", $(this.options.cropframe).getStyle("height").toInt() * this.options.fixedratio);
		}

		this.updateCropDims($(this.options.cropframe));

		this.myMove = new Drag.Move($(this.options.cropframe), {
			style: true,
			precalculate: true,
			snap: 1,
			grid: false,
			container: $(this.options.imgframe),
			includeMargins: false,
			checkDroppables: false,
			handle: $(this.options.draghandle),

			onStart: function(el) {
				el.addClass(this.options.classactive);
			}.bind(this),

			onDrag: function(el) {
				this.moveBgImage(el);
				this.updateCropDims(el, true);
			}.bind(this),

			onComplete: function(el) {
				el.removeClass(this.options.classactive);
				this.updateCropDims(el);
				this.recalcResize(el);
			}.bind(this)
		});

		this.moveBgImage($(this.options.cropframe));

		this.myResizeXY = $(this.options.cropframe).makeResizable({
			style: true,
			precalculate: true,
			snap: 1,
			grid: false,
			handle: $(this.options.resizehandle),
			limit: this.limits,

			onStart: function(el) {
				el.addClass(this.options.classactive);
			}.bind(this),

			onDrag: function(el, event) {
				this.checkRatio(el, event);
				this.updateCropDims(el);
			}.bind(this),

			onComplete: function(el) {
				el.removeClass(this.options.classactive);
			}.bind(this)
		});

		if ($(this.options.cropbtn)) {
			$(this.options.cropbtn).addEvent('click', function() {
				this.doCrop();
			}.bind(this));
		}
	},

	moveBgImage: function(el)
	{
		el.setStyle("background-position","-" + (el.getStyle("left").toInt() + 1) + "px " + "-" + (el.getStyle("top").toInt() + 1) + "px");
	},

	checkRatio: function(el, event)
	{
		ratio = el.getStyle("width").toInt() / el.getStyle("height").toInt();
		if (this.options.fixedratio) {
			if (ratio != this.options.fixedratio) {
				el.setStyle("width", el.getStyle("height").toInt() * this.options.fixedratio);
			}
			return;
		}

		if (event.shift) {
			if (ratio > 1) {
				el.setStyle("width", el.getStyle("height").toInt());
			}
			else if (ratio < 1) {
				el.setStyle("height", el.getStyle("width").toInt());
			}
			return;
		}

		if (ratio > 1 && ratio > this.options.maxratio.x) {
			el.setStyle("width", el.getStyle("height").toInt() * this.options.maxratio.x);
		}
		else if (ratio < 1 && ratio < (1/this.options.maxratio.y)) {
			el.setStyle("height", el.getStyle("width").toInt() * this.options.maxratio.y);
		}
	},

	recalcResize: function(el)
	{
		this.limits.x[1] = this.elemsize.x - ( el.getStyle("left").toInt() ) - 2;
		this.limits.y[1] = this.elemsize.y - ( el.getStyle("top").toInt()  ) - 2;

		this.limits.x[1] = Math.round( Math.min( this.limits.x[1], this.options.maxsize.x ) );
		this.limits.y[1] = Math.round( Math.min( this.limits.y[1], this.options.maxsize.y ) );

		this.myResizeXY.options.limit = this.limits;
	},

	updateCropDims: function(el, displayPosition)
	{
		if (!$(this.options.cropdims)) {
			return;
		}
		if (displayPosition) {
			xresized = Math.round( el.getStyle("left").toInt() * this.orig_to_scaled.x );
			yresized = Math.round( el.getStyle("top").toInt() * this.orig_to_scaled.y );
			out = xresized + ", " + yresized;
		}
		else {
			xresized = Math.round( el.getStyle("width").toInt() * this.orig_to_scaled.x );
			yresized = Math.round( el.getStyle("height").toInt() * this.orig_to_scaled.y );
			out = xresized + " x " + yresized;
		}

		$(this.options.cropdims).set('html', out);
	},

	doCrop: function()
	{
		el = $(this.options.cropframe);

		var x = Math.round( el.getStyle("left").toInt() * this.orig_to_scaled.x );
		var y = Math.round( el.getStyle("top").toInt() * this.orig_to_scaled.y );
		var w = Math.round( el.getStyle("width").toInt() * this.orig_to_scaled.x );
		var h = Math.round( el.getStyle("height").toInt() * this.orig_to_scaled.y );

		if (x >= 0 && y >= 0 && h >= this.options.minsize.y && w >= this.options.minsize.x) {
			this.fireEvent('onCrop',{'x':x,'y':y,'w':w,'h':h});
		}
	}

});