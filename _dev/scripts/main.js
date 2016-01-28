jQuery(document).ready(function($) {
	$('.slideshow').bxSlider();

	$('.quote p, .reviews__list').columnize({
		columns : 2
	});
	// $('.reviews__list').columnize({
	// 	columns : 2
	// });
});
