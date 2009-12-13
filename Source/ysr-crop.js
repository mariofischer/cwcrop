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
...
*/
CwCrop = new Class({

	Implements: [Options,Events],

	options: {
		minsize: {x: 60, y: 60},
		maxsize: {x: 200, y: 200},
		initialposition: {x: 10, y: 10},
		fixedratio: false,
		maxratio: {x: 2, y: 2},
		originalsize: {x: 1, y: 1},
		initialmax: false,
		classactive: "active",
		cropframe: "cropframe",
		imgframe: "imglayer",
		cropdims: "cropdims",
		cropbtn: "cropbtn",
		draghandle: "draghandle",
		resizehandle: "resizeHandleXY",
		onCrop: $empty
	},

	initialize: function(options)
	{
		this.setOptions(options);

		if (!$(this.options.cropframe) || !$(this.options.imgframe)) {
			return;
		}

		// calc initial limits
		this.elemsize = $(this.options.imgframe).getSize();
		if (this.elemsize.x == 0) {
			this.elemsize = $(this.options.imgframe).getOffsetParent().getSize();
		}
		this.limits = {
						x:[this.options.minsize.x, Math.min(this.elemsize.x-2, this.options.maxsize.x)],
						y:[this.options.minsize.y, Math.min(this.elemsize.y-2, this.options.maxsize.y)]
					};
		
		// init crop frame
		if (this.options.initialmax) {
			$(this.options.cropframe).setStyle("top", 0);
			$(this.options.cropframe).setStyle("left", 0);
			$(this.options.cropframe).setStyle("width", this.limits.x[1]);
			$(this.options.cropframe).setStyle("height", this.limits.y[1]);		
		}
		else {		
			$(this.options.cropframe).setStyle("top", this.options.initialposition.x);
			$(this.options.cropframe).setStyle("left", this.options.initialposition.y);
			$(this.options.cropframe).setStyle("width", this.options.minsize.x);
			$(this.options.cropframe).setStyle("height", this.options.minsize.y);
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
			handle: $(this.options.draghandle),

			onStart: function(el) {
				/*
				if ($(this.options.cropdims).getParent()) {
					$(this.options.cropdims).getParent().setStyle('display', 'none');
				}
				*/
				el.addClass(this.options.classactive);
			}.bind(this),
			
			onDrag: function(el) {
				this.moveBgImage(el);
				this.antMarching(el);
				this.updateCropDims(el, true);
			}.bind(this),
			
			onComplete: function(el) {
				/*
				if ($(this.options.cropdims).getParent()) {
					$(this.options.cropdims).getParent().setStyle('display', 'block');
				}
				*/
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
				this.antMarching(el);
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

	antMarching: function(el)
	{
		// el.toggleClass("ants");
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
		}
		else {
			if (ratio > 1 && ratio > this.options.maxratio.x) {
				el.setStyle("width", el.getStyle("height").toInt() * this.options.maxratio.x);
			}
			else if (ratio < 1 && ratio < (1/this.options.maxratio.y)) {
				el.setStyle("height", (el.getStyle("width").toInt() * this.options.maxratio.y));
			}
		}
	},

	recalcResize: function(el)
	{
		this.limits.x[1] = this.elemsize.x - ( el.getStyle("left").toInt() ) - 2;
		this.limits.y[1] = this.elemsize.y - ( el.getStyle("top").toInt()  ) - 2;
		
		this.limits.x[1] = Math.min(this.limits.x[1], this.options.maxsize.x);
		this.limits.y[1] = Math.min(this.limits.y[1], this.options.maxsize.y);
		
		this.myResizeXY.options.limit = this.limits;
	},
	
	updateCropDims: function(el, displayPosition)
	{
		if (!$(this.options.cropdims)) {
			return;
		}
		if (displayPosition) {
			if (this.options.originalsize.x > 1) {
				xresized = (el.getStyle("left").toInt() * this.options.originalsize.x / this.elemsize.x).toInt();
				yresized = (el.getStyle("top").toInt() * this.options.originalsize.y / this.elemsize.y).toInt();
			} else {
				xresized = el.getStyle("left").toInt();
				yresized = el.getStyle("top").toInt();
			}
			out = xresized + ", " + yresized;
		}
		else {
			if (this.options.originalsize.x > 1) {
				xresized = (el.getStyle("width").toInt() * this.options.originalsize.x / this.elemsize.x).toInt();
				yresized = (el.getStyle("height").toInt() * this.options.originalsize.y / this.elemsize.y).toInt();
			} else {
				xresized = el.getStyle("width").toInt();
				yresized = el.getStyle("height").toInt();
			}
			out = xresized + " x " + yresized;
		}
		
		$(this.options.cropdims).set('html', out);
	},

	doCrop: function()
	{
		el = $(this.options.cropframe);

		var x = el.getStyle("left").toInt();
		var y = el.getStyle("top").toInt();
		var w = el.getStyle("width").toInt();
		var h = el.getStyle("height").toInt();

		if (x >= 0 && y >= 0 && h >= this.options.minsize.y && w >= this.options.minsize.x) {
		
			this.fireEvent('onCrop',{'x':x,'y':y,'w':w,'h':h});
		}
	}

});
