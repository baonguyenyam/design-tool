// Main
$(document).ready(function() {
	$('.canhcam-design-1 .select-nav-slider .owl-carousel').owlCarousel({
		loop: true,
		padding: 10,
		margin: 10,
		nav: true,
		dots: false,
		autoHeight: true,
		navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 3
			}
		}
	})
});
