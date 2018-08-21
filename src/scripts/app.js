angular.module('canhCamApp', [])
	.filter('html', ['$sce', function ($sce) {
		return function (val) {
			return $sce.trustAsHtml(val);
		};
	}])
	.controller('getMenu', function ($scope, $http) {
		$http({
			method: 'GET',
			url: baoNguyenApp.API.home
		}).then(function (response) {
			$scope.menus = eval(response.data.menu);
		}, function (error) {
			console.log('Error: ' + error);
		});
	});
