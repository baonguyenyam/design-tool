var baoNguyenApp = {
	// API hệ thống 
	API: {
		menu: '/db/db.json',
		material: '/db/material.json',
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
	}
}

function toggleMenu(el) {
	$(el).parents('ul').find('li').removeClass('active')
	$(el).parents('li').addClass('active')
}

function materialHeight() {
	$(".select-nav-color .item").each(function () {
		$(this).height($(this).width())
	});
}
// Canh Cam Code
$(document).ready(() => {
	baoNguyenApp.init()
	baoNguyenApp.fetch(baoNguyenApp.API.menu, 'GET', (e) => {
		console.log(e.responseJSON)
	})
});

$(window).resize(() => {
	$(".select-nav-color .item").each(function () {
		$(this).height($(this).width())
	});
});
