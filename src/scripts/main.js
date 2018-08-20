var baoNguyenApp = {
	// API hệ thống 
	API: {
		home: '/db/db.json'
	},
	// Bật loadding 
	loading: (i) => {
		i && 1 == i ? $("#loading").removeClass("done").removeClass("finished") : (setTimeout(() => {
			$("#loading").addClass("done")
		}, 200), setTimeout(() => {
			$("#loading").removeClass("done").addClass("finished")
		}, 1e3))
	},
	// Load dữ liệu & xử lý
	fetch: (e, o, n) => {
		baoNguyenApp.loading(!0), $.ajax({
			url: e,
			type: o,
			dataType: "json",
			cache: !0,
			complete: (e) => {
				n(e), baoNguyenApp.loading(!1)
			}
		})
	},
	// Khởi tạo app
	init: () => {
		$('[data-toggle="tooltip"]').tooltip()
		$('.canhcam-design-1 .select-nav-slider .owl-carousel').owlCarousel({
			loop: true,
			padding: 10,
			margin: 10,
			nav: true,
			dots: false,
			autoHeight: true,
			navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
		})
	}
}
// Canh Cam Code
$(document).ready(() => {
	baoNguyenApp.init()
	baoNguyenApp.fetch(baoNguyenApp.API.home, 'GET', (e) => {
		console.log(e.responseJSON.data)
	})
});
