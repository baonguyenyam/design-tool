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
app.controller('mainControl', function ($scope, $http, $rootScope) {
	$scope.showloading = false
	$scope.imageSave = null
	$scope.imageSaveBASE64 = null
	$scope.materials = []
	$scope.showloadingmaterial = false
	$scope.showdone = false
	// $scope.buildimagedone = false
	$scope.CAT_URL = getUrlParameter('productid'),
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
		$scope.settings = eval(response.data.settings);

	}, function (error) {
		console.log('Lỗi Data: ' + error);
	});

	$scope.setPattern = function (e) {
		doSetMaterial(e, $scope, $http, $rootScope)
	}

	$scope.buildImage = function () {
		doneBuilder($scope)
	}

	$scope.saveImage = function () {

		html2canvas(document.querySelector("#drawimages"), {
			logging: false
		}).then(canvas => {
			var dataURL = canvas.toDataURL();
			$scope.imageSave = canvas
			$scope.imageSaveBASE64 = dataURL
			$scope.imageSave.toBlob(function (blob) {
				saveAs(blob, "LIENA-PRO.png");
			});
		});

	}
	$scope.shareImage = function () {
		html2canvas(document.querySelector("#drawimages"), {
			logging: false
		}).then(canvas => {
			var dataURL = canvas.toDataURL();
			$scope.imageSave = canvas
			$scope.imageSaveBASE64 = dataURL

			let dataToOrder = {
				image: $scope.imageSaveBASE64,
				productId: parseInt($scope.CAT_URL),
				pat: ($rootScope.dataPat).toString()
			}
			$http({
				method: 'POST',
				url: baoNguyenApp.API.URL + baoNguyenApp.API.share, 
				data: dataToOrder
			}).then(function (response) {
				if(response.success) {
					window.location.href = response.success.redirect;
				}
			}, function (error) {
				console.log('Lỗi Save: ' + error);
			});

		});
	}
	$scope.order = function () {
		
		html2canvas(document.querySelector("#drawimages"), {
			logging: false
		}).then(canvas => {
			var dataURL = canvas.toDataURL();
			$scope.imageSave = canvas
			$scope.imageSaveBASE64 = dataURL

			let dataToOrder = {
				image: $scope.imageSaveBASE64,
				productId: parseInt($scope.CAT_URL),
				pat: ($rootScope.dataPat).toString()
			}
			$http({
				method: 'POST',
				url: baoNguyenApp.API.URL + baoNguyenApp.API.save, 
				data: dataToOrder
			}).then(function (response) {
				if(response.success) {
					window.location.href = response.success.redirect;
				}
			}, function (error) {
				console.log('Lỗi Save: ' + error);
			});

		});

	}

});
// Child Controller
app.controller('getMenuMaterial', function ($scope, $http, $rootScope) {
	$http({
		method: 'GET',
		url: baoNguyenApp.API.URL + baoNguyenApp.API.menu,
	}).then(function (response) {
		$scope.menus = eval(response.data.menu);
		$scope.ctrlClickHandler = function (e, m) {
			$rootScope.index = m
			getMaterial(e, $scope, $http, $rootScope)
		}
		if ($scope.PA_URL && $scope.PA_URL != 'undefined') {
			$rootScope.dataPat = $scope.PA_URL.split(",")
			var empIds = $scope.PA_URL.split(",")
			for (let index = 0; index < $scope.menus.length; index++) {
				$http({
					method: 'GET',
					url: baoNguyenApp.API.URL + baoNguyenApp.API.material + "?id=" + $scope.menus[index].id
				}).then(function (data) {
					$scope.data = eval(data.data.lists);
					var filteredArray = $scope.data.filter(function(itm){
						return empIds.indexOf(''+itm.id+'') > -1;
					});
					getPat(filteredArray, index, filteredArray[0].id, $rootScope)
				}, function (error) {
					console.log('Lỗi Material: ' + error);
				});
			}
			// doneBuilder($scope, $http)
		}
	}, function (error) {
		console.log('Lỗi Menu: ' + error);
	});
});

function getMaterial(el, $scope, $http, $rootScope) {
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
		url: baoNguyenApp.API.URL + baoNguyenApp.API.material + "?id=" + el
	}).then(function (response) {
		$scope.materials = eval(response.data.lists);
		$rootScope.dataCat = el
		// Phân trang
		$scope.totalItems = response.data.lists.length;
		$scope.lists = $scope.materials.slice((($scope.currentPage - 1) * $scope.itemsPerPage), (($scope.currentPage) * $scope.itemsPerPage))
		// Phân trang
		$scope.showloading = false
	}, function (error) {
		console.log('Lỗi Material: ' + error);
	});


}

function doSetMaterial(e, $scope, $http, $rootScope) {
	$scope.showloadingmaterial = true
	$scope.showdone = true
	$http({
		method: 'GET',
		url: baoNguyenApp.API.URL + baoNguyenApp.API.material + "?id=" + $rootScope.dataCat
	}).then(function (response) {
		$scope.data = eval(response.data.lists);
		let newArray = $scope.data.filter(function (el) {
			return el.id == e
		});
		getPat(newArray, $rootScope.index, e, $rootScope)
	}, function (error) {
		console.log('Lỗi Data: ' + error);
	});
	$scope.showloadingmaterial = false
}

function getPat(newArray, e, m, $rootScope) {
	$rootScope.dataPat[e] = m
	if (e == 0) {
		$('.blockprodis-nem .nem').css({
			"background-color": newArray[0].color[0]
		})
	} else if (e == 2) {
		$('.blockprodis-goiom .goiom').css({
			"background-color": newArray[0].color[0]
		})
	} else if (e == 1) {
		$('.blockprodis-goi .goi').css({
			"background-color": newArray[0].color[0]
		})
	} else if (e == 3) {
		$('.blockprodis-men-b .men-b').css({
			"background-color": newArray[0].color[0]
		})
		$('.blockprodis-men-f .men-f').css({
			"background-color": newArray[0].color[0]
		})
	} else {
		$('.blockprodis-men-b .men-b').css({
			"background-color": newArray[0].color[1]
		})
		$('.blockprodis-men-f .men-f').css({
			"background-color": newArray[0].color[0]
		})
	}
}

function doneBuilder($scope) {
	$scope.showloadingmaterial = true
	$scope.showdone = false
	html2canvas(document.querySelector("#drawimages"), {
		logging: false
	}).then(canvas => {
		var dataURL = canvas.toDataURL();
		$('#resultsdraw').html('<img class="img-fluid" src="' + dataURL + '">')
		$('#drawimages').hide()
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
