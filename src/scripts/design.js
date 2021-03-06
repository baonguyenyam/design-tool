var baoNguyenApp = {
	// API hệ thống 
	API: {
		URL: "",
		main: './db/main.json',
		menu: './db/menu.json',
		save: '/Product/Services/Api/Drap/Save.ashx',
		share: '/Product/Services/Api/Drap/Share.ashx',
		material: './db/material.json',
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
		$('.control-bar .toggle a').on('click', function () {
			$('.control-bar').addClass('active')
		})
	}
}

function setToolPos() {
	let a = $('.select-nav').outerHeight()
	let b = $('.select-nav .select-nav-color .notice').outerHeight()
	let c = $('.select-nav .done-bar').outerHeight()
	let m = a - c - 50
	if ((a - (b + c)) > 0 && $(window).height() > 600) {
		$('.select-nav .select-nav-color .notice').height(m)
	}
}

function setToolPosC() {
	let a = $('.select-nav').outerHeight()
	let b = $('.select-nav .select-nav-color .list-item').outerHeight()
	let c = $('.select-nav .done-bar').outerHeight()
	let m = a - c - 60
	if ((a - (b + c)) > 0 && $(window).height() > 600) {
		$('.select-nav .select-nav-color .list-item').height(m)
	}
}

function toggleMenu(el) {
	$(el).parents('ul').find('li').removeClass('active')
	$(el).parents('li').addClass('active')
	setToolPosC()
}

function toggleMenuChild(el) {
	$(el).parents('ul').find('li').removeClass('active')
	$(el).addClass('active')
}

//FUNCTION TO RESIZE SELECT NAV TO EQUALS BOX-PRODUCT
function equalBoxSize() {
	$('.select-color').matchHeight({
		property: 'height',
		target: $('.apply-content'),
	});
}

// Canh Cam Code
$(document).ready(() => {
	baoNguyenApp.init()
	baoNguyenApp.fetch(baoNguyenApp.API.URL + baoNguyenApp.API.main, 'GET', (e) => {
		// console.log(e.responseJSON)
		setTimeout(() => {
			setToolPosC()
		}, 500);
	})
	setToolPos()
	equalBoxSize()
});

$(window).resize(() => {
	setTimeout(() => {
		setToolPos()
	}, 500);
});
