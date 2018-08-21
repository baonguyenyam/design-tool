var app = angular.module('canhCamApp', ['ui.bootstrap']);
// Filter 
app.filter('html', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsHtml(val);
	};
}])
// Main Controller
app.controller('mainControl', function ($scope, $http) {
	$scope.lang = {
		loading: 'Đang tải dữ liệu...',
		noitem: 'Không có danh mục nào cả!',
		material: 'Danh mục chất liệu'
	}
	$http({
		method: 'GET',
		url: baoNguyenApp.API.main
	}).then(function (response) {
		$scope.data = eval(response.data.settings);
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
			getMaterial($scope, $http)
		}
	}, function (error) {
		console.log('Lỗi Menu: ' + error);
	});
});

function getMaterial($scope, $http) {
	$scope.showloading = false
	$scope.materials = []
	$scope.showloading = true
	$http({
		method: 'GET',
		url: baoNguyenApp.API.material
	}).then(function (response) {
		$scope.materials = eval(response.data.lists);
		if($scope.materials.length>0) {
			setTimeout(() => {
				materialHeight()
			}, 100);
		}
		$scope.showloading = false
	}, function (error) {
		console.log('Lỗi Material: ' + error);
	});
}

function doSetMaterial(e, $scope, $http) {
	$scope.showloadingmaterial = false
	$scope.showloadingmaterial = true
	// $scope.showloadingmaterial = false
	console.log(e)
}
