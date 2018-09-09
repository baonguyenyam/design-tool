var app = angular.module('canhCamApp', ['ui.bootstrap']);
// Config
app.config(['$compileProvider',
	function ($compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
	}
]);
// Filter 
app.filter('html', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsHtml(val);
	};
}])
// Main Controller
app.controller('mainControl', function ($scope, $http, $location) {
	$scope.showloading = false
	$scope.imageSave = null
	$scope.imageSaveBASE64 = null
	$scope.materials = []
	$scope.showloadingmaterial = false
	$scope.showdone = false
	$scope.buildimagedone = false
	$scope.CAT_URL = getUrlParameter('cat'),
	$scope.PA_URL = getUrlParameter('pat')
	$scope.lang = {
		loading: 'Đang tải dữ liệu...',
		pattern: 'Mẫu',
		share: 'Chia sẻ',
		done: 'Hoàn thành',
		booking: 'Đặt hàng',
		save: 'Lưu ảnh',
		itempage: 'Số mẫu/trang',
		noitem: 'Danh sách màu phối!',
		notice: 'Vui lòng chọn danh mục bên cạnh để thực hiện phối màu',
		material: 'Danh mục chất liệu'
	}
	$http({
		method: 'GET',
		url: baoNguyenApp.API.main
	}).then(function (response) {
		$scope.data = eval(response.data.settings);

		if($scope.CAT_URL && $scope.CAT_URL != 'undefined'){
			getMaterial($scope.CAT_URL, $scope, $http)
		}
		if($scope.PA_URL && $scope.PA_URL != 'undefined'){
			doSetMaterial($scope.PA_URL, $scope, $http)
		}

	}, function (error) {
		console.log('Lỗi Data: ' + error);
	});

	$scope.setPattern = function (e) {
		doSetMaterial(e, $scope, $http)
	}

});
// Child Controller
app.controller('getMenuMaterial', function ($scope, $http) {
	$http({
		method: 'GET',
		url: baoNguyenApp.API.menu
	}).then(function (response) {
		$scope.menus = eval(response.data.menu);
		$scope.ctrlClickHandler = function (e) {
			getMaterial(e, $scope, $http)
		}
	}, function (error) {
		console.log('Lỗi Menu: ' + error);
	});
});

function getMaterial(el, $scope, $http) {
	// Phân trang
	$scope.dataCat = el
	$scope.lists = []
	$scope.viewby = 1000; // Default 12 
	$scope.currentPage = 1;
	$scope.itemsPerPage = $scope.viewby;
	$scope.maxSize = 3;
	$scope.select = [{
			id: 12,
			name: '12'
		},
		{
			id: 20,
			name: '20'
		},
		{
			id: 24,
			name: '24'
		},
		{
			id: 40,
			name: '40'
		},
		{
			id: 48,
			name: '48'
		}
	];
	$scope.viewby = $scope.select[0];
	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};
	$scope.pageChanged = function () {
		$scope.lists = $scope.materials.slice((($scope.currentPage - 1) * $scope.itemsPerPage), (($scope.currentPage) * $scope.itemsPerPage))
	};
	$scope.setItemsPerPage = function (num) {
		$scope.itemsPerPage = num.id;
		$scope.currentPage = 1;
		$scope.lists = $scope.materials.slice((($scope.currentPage - 1) * $scope.itemsPerPage), (($scope.currentPage) * $scope.itemsPerPage))
	}
	// Phân trang
	$scope.showloading = true
	$http({
		method: 'GET',
		url: baoNguyenApp.API.material + "?id=" + el
	}).then(function (response) {
		$scope.materials = eval(response.data.lists);
		// Phân trang
		$scope.totalItems = response.data.lists.length;
		$scope.lists = $scope.materials.slice((($scope.currentPage - 1) * $scope.itemsPerPage), (($scope.currentPage) * $scope.itemsPerPage))
		// Phân trang
		$scope.showloading = false
	}, function (error) {
		console.log('Lỗi Material: ' + error);
	});

	$scope.buildImage = function () {
		doneBuilder($scope, $http)
	}

	$scope.saveImage = function () {
		$scope.imageSave.toBlob(function(blob) {
			saveAs(blob, "pretty image.png");
		});
	}
	$scope.shareImage = function () {
		console.log($scope.imageSaveBASE64)
	}
	$scope.order = function () {
		let dataToOrder = {
			img: $scope.imageSaveBASE64,
			cat: $scope.dataCat,
			pat: $scope.dataPat
		}
		console.log(dataToOrder)
	}
}

function doSetMaterial(e, $scope, $http) {
	$scope.showloadingmaterial = true
	$scope.showdone = true
	$scope.dataPat = e
	$('.apply-content').html(e)
	$scope.showloadingmaterial = false
}

function doneBuilder($scope, $http) {
	$scope.showloadingmaterial = true
	$scope.showdone = false
	$scope.buildimagedone = true
	html2canvas(document.querySelector("#drawimages"), {
		logging: false
	}).then(canvas => {
		var dataURL = canvas.toDataURL();
		$('#resultsdraw').html('<img class="img-fluid" src="'+dataURL+'">')
		$scope.imageSave = canvas
		$scope.imageSaveBASE64 = dataURL
		
	});
	$scope.showloadingmaterial = false
}
function getUrlParameter(param, dummyPath) {
	var sPageURL = dummyPath || window.location.search.substring(1),
		sURLVariables = sPageURL.split(/[&||?]/),
		res;

	for (var i = 0; i < sURLVariables.length; i += 1) {
		var paramName = sURLVariables[i],
			sParameterName = (paramName || '').split('=');

		if (sParameterName[0] === param) {
			res = sParameterName[1];
		}
	}

	return res;
}
