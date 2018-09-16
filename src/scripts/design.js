var baoNguyenApp = {
	// API hệ thống 
	API: {
		URL: "http://preview8611.canhcam.com.vn",
		main: './db/main.json',
		menu: '/Product/Services/Api/Drap/List.ashx',
		save: '/Product/Services/Api/Drap/Save.ashx',
		material: '/Product/Services/Api/Drap/Detail.ashx',
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
		$('.control-bar .toggle a').on('click', function() {
			$('.control-bar').addClass('active')
		})
	}
}

function toggleMenu(el) {
	$(el).parents('ul').find('li').removeClass('active')
	$(el).parents('li').addClass('active')
}

function toggleMenuChild(el) {
	$(el).parents('ul').find('li').removeClass('active')
	$(el).addClass('active')
}

// Canh Cam Code
$(document).ready(() => {
	baoNguyenApp.init()
	baoNguyenApp.fetch(baoNguyenApp.API.main, 'GET', (e) => {
		// console.log(e.responseJSON)
	})
	
});

$(window).resize(() => {
});
