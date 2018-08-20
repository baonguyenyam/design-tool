var baoNguyenApp = {
	// API hệ thống 
	API: {
		home: '/db/db.json'
	},
	// Bật loadding 
	loading: function (i) {
		i && 1 == i ? $("#loading").removeClass("done").removeClass("finished") : (setTimeout(function () {
			$("#loading").addClass("done")
		}, 200), setTimeout(function () {
			$("#loading").removeClass("done").addClass("finished")
		}, 1e3))
	},
	// Load dữ liệu & xử lý
	fetch: function(e, o, n) {
        baoNguyenApp.loading(!0), $.ajax({
            url: e,
            type: o,
            dataType: "json",
            cache: !0,
            complete: function(e) {
                n(e), baoNguyenApp.loading(!1)
            }
        })
	},
	// Khởi tạo app
	init: function () {
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
$(document).ready(function () {
	baoNguyenApp.init()
	baoNguyenApp.fetch(baoNguyenApp.API.home, 'GET', function (e) {
		console.log(e.responseJSON.data)
	})
});
