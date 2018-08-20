var baoNguyenApp = {
	loading: function (i) {
		i && 1 == i ? $("#loading").removeClass("done").removeClass("finished") : (setTimeout(function () {
			$("#loading").addClass("done")
		}, 200), setTimeout(function () {
			$("#loading").removeClass("done").addClass("finished")
		}, 1e3))
	},
	init: function() {
		// Bật Loading
		this.loading(true)
		$('[data-toggle="tooltip"]').tooltip()
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
		// Tắt Loading
		this.loading(false)
	}
}
// Main
$(document).ready(function() {
	baoNguyenApp.init()
});
