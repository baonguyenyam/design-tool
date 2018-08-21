var app = angular.module('canhCamApp', ['ui.bootstrap']);
// Filter 
app.filter('html', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsHtml(val);
	};
}])
// Main Controller
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
		$scope.showloading = false
	}, function (error) {
		console.log('Lỗi Material: ' + error);
	});
}
