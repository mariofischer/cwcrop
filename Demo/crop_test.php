<?php
include('../_includes/Imaging.inc.php');

$path_original = '/cwcrop/';
$path_crop = '/cwcrop/';
$src_name = 'orig.jpg';

$src_scaled = $path_crop.'prev_'.$src_name;
$src_original = $path_original.$src_name;

$target_xmaxsize = 500;
$target_ymaxsize = 300;

$max_ratio = 3;

if (!file_exists($_SERVER['DOCUMENT_ROOT'].$src_scaled)) {
	Imaging::rescaleImage($_SERVER['DOCUMENT_ROOT'].$src_original, $_SERVER['DOCUMENT_ROOT'].$src_scaled, $target_xmaxsize, $target_ymaxsize);
}

list($width, $height, $type) = getimagesize($_SERVER['DOCUMENT_ROOT'].$src_scaled);
list($width_o, $height_o, $type) = getimagesize($_SERVER['DOCUMENT_ROOT'].$src_original);

if (isset($_POST['crop'])) {

	list($width_s, $height_s, $type) = getimagesize($_SERVER['DOCUMENT_ROOT'].$src_scaled);
	list($width_o, $height_o, $type) = getimagesize($_SERVER['DOCUMENT_ROOT'].$src_original);

	$crop = $_POST['crop'];
	$vars = array('x','y','w','h');
	foreach ($vars as $var) {
		$crop[$var] = intval($crop[$var]);
		if ($crop[$var] < 0) $crop[$var] = 0;
		if ($crop[$var] > 1200) $crop[$var] = 300;
	}
	$scale_ratio_x = $width_o / $width_s;
	$scale_ratio_y = $height_o / $height_s;
/*
	$crop['x'] = $crop['x'] * $scale_ratio_x;
	$crop['w'] = $crop['w'] * $scale_ratio_x;
	$crop['y'] = $crop['y'] * $scale_ratio_y;
	$crop['h'] = $crop['h'] * $scale_ratio_y;
*/
	$target_file = $path_crop.'crop-'.$src_name;
	$res = Imaging::cropImage($_SERVER['DOCUMENT_ROOT'].$src_scaled, $_SERVER['DOCUMENT_ROOT'].$target_file, $crop['x'], $crop['y'], $crop['w'], $crop['h']);
	if (!$res) {
		unset($target_file);
	}
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="author" content="Mario Fischer" />
	<link rel="stylesheet" type="text/css" href="ysr-reset-min.css" media="all" />
	<link rel="stylesheet" type="text/css" href="/blog/wp-content/themes/chipwreck/style.css" media="all" />
	<link rel="stylesheet" type="text/css" href="ysr-crop-yc.css" media="all" />
	<script type="text/javascript" src="mootools-1.2.3-core-yc.js"></script>
	<script type="text/javascript" src="mootools-1.2.3.1-more-yc.js"></script>
	<script type="text/javascript" src="ysr-crop-yc.js"></script>
	<title>Chipwreck | Javascript CwCrop Example Page</title>
</head>

<body>
<script type="text/javascript">
var ch,ch2;
window.addEvent("domready", function() {
//	ch2 = new MyCrop({originalsize: {x: <?=$width_o ?> , y: <?=$height_o ?>}});
	ch = new MyCrop();
});

</script>

<div class="content-box">
	<div class="grid-inner">
		<h1>CwCrop - Javascript Image Crop</h1>
		<p>
			<a href="/blog/">Back to the website/blog &raquo;</a>
		</p>
		<p>
			This is a javascript-(mootools)-only tool to select a part of an image to crop it (or whatever).
		</p>
		
		<h3>Works..</h3>
		<ul>
			<li>..in Safari 3+, Firefox 3+, IE 6, IE 7, IE 8 and Opera 9+</li>
			<li>Requires mootools 1.2+ and (for example) PHP to crop the image</li>
		</ul>
		<br />
		
		<h3>Features..</h3>
		<ul>
			<li>Only 4 DIVs necessary</li>
			<li>Marching Ants effect via CSS..! <span class="date">(Safari and Firefox of course only)</span></li>
			<li>Shows crop dimensions (w x h) - and x/y-position while moving <span class="date">(configurable)</span></li>
			<li>Crop-Button inside the frame <span class="date">(optional)</span></li>
			<li>Hold <kbd>SHIFT</kbd> to select a square area</li>
			<li>Also works with scaled images - shows the real size then</li>
		</ul>
		<br />
		<ul>
			<li>Minimal size, maximal size, initial position and x-/y-ratio constraints are configurable</li>
			<li>Result: x- and y-position, width and height</li>
		</ul>
		<p>&nbsp;</p>
			
		<?php if (isset($target_file)) { ?>
	
		<h2>Cropped Image</h2>
			<p>
				<img src="<?=$target_file ?>" />
			</p>
			<p>
				<a href="crop_test.php">&laquo; Try again</a>
			</p>
	
		<?php } else { ?>
		
			<h2>
				Example to try - hold <em>SHIFT</em> to select a square area:
			</h2>		
	
			<div id="imgouter">

				<div id="cropframe" style="background-image: url('<?=$src_scaled ?>')">
						<div id="draghandle"></div>
						<div id="resizeHandleXY" class="resizeHandle"></div>
						<div id="cropinfo" rel="Click to crop">
							<div title="Click to crop" id="cropbtn"></div>
							<div id="cropdims"></div>
						</div>
					</div>
				
				<div id="imglayer" style="width: <?=$width ?>px; height: <?=$height ?>px; background-image: url('<?=$src_scaled ?>')">
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
			
			<div class="excerpt">
				<h4>Settings:</h4>
				<p>
				Minimum size: x: 90, y: 90<br />
				Maximum size: x: 200, y: 200<br />
				Initial position: x: 10, y: 10<br />
				Ratio constraint:  x: 1.5, y: 1.5
				</p>
			</div>
	
		<?php } ?>
	</div>
</div>
<br />
<div class="content-box">
	<div class="grid-inner">
		<p>Download, documentation etc. soon - write a comment to the blog if you're interested.</p>
		<p>
			<a href="/blog/">Back to the website/blog &raquo;</a>
		</p>
	</div>
</div>
	

<script type="text/javascript">
	var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
	document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
	try {
		var pageTracker = _gat._getTracker("UA-3640788-1");
	} catch(err) {}
</script>
<script src="http://www.chipwreck.de/blog/wp-content/plugins/google-analytics-for-wordpress/custom_se.js" type="text/javascript"></script>
<script type="text/javascript">
	try {
		// Cookied already: 
		pageTracker._trackPageview();
	} catch(err) {}
</script>
			
</body>
</html>