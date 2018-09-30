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
	$rootScope.genIMG = []
	$rootScope.imageSaveBASE64 = null
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
		url: baoNguyenApp.API.URL + baoNguyenApp.API.main,
	}).then(function (response) {
		$scope.settings = eval(response.data.settings);
		$scope.header = $scope.settings.header.replace("/Data/Sites/", baoNguyenApp.API.URL + "/Data/Sites/");
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
		/**
		 * Tạo một canvas và append vào cây DOM, node cha của nó là thẻ body.
		 * Chỉ dùng để hỗ trợ cho hàm saveImage nên để display: none
		 * Kích thước mặc định là 1500px x 1125px để bảo đảm chất lượng hình ảnh khi xuất ra
		 * Không có giá trị trả về
		 * @param {Id đặt cho thẻ canvas} canvasId
		 */
		const createCanvas = (canvasId) => {
			let canvas = document.createElement('canvas')
			canvas.id = canvasId
			canvas.width = 1500
			canvas.height = 1125
			canvas.style.display = 'none'
			document.body.appendChild(canvas);
		}

		/**
		 * Tạo một Image object, có attribute src là đường dẫn imgUrl truyền vào
		 * @return 1 promise, resolve khi image được load thành công, reject khi có lỗi xảy ra.
		 * @param {Đường dẫn của ảnh cần tạo} imgUrl 
		 */
		const createImage = imgUrl => {
			return new Promise((resolve, reject) => {
				try {
					const img = new Image();
					img.onload = () => resolve(img);
					img.src = imgUrl;
				} catch (error) {
					reject(error);
				}
			});
		};


		/**
		 * Vẽ image với colorCode tương ứng lên canvas, 1 image 1 lần gọi hàm.
		 * @return 1 promise, resolve khi image được draw thành công, reject khi có lỗi xảy ra.
		 * @param {Image object} image 
		 * @param {Mã màu cần phủ lên image, có dạng mã Hex} colorCode 
		 */
		const drawImage = (image, colorCode) => {
			return new Promise((resolve, reject) => {
				try {
					//Tạo 2 biến chứa object CanvasRenderingContext2D để render hình ảnh
					//2 canvas được tạo ẩn, và sẽ bị remove khỏi DOM ngay khi download hình ảnh
					let canvas = document.getElementById("myCanvas");
					let tempCanvas = document.getElementById("tempCanvas");

					let context = canvas.getContext("2d");
					let tempContext = tempCanvas.getContext("2d");

					//Vẽ image lên tempCanvas - canvas phụ
					tempContext.drawImage(image, 0, 0);
					if (colorCode !== "") {
						//Nếu colorCode được khai báo thì đổ màu lên hình ảnh
						//Khi đổ màu, vì thiết lập globalCompositeOperation nên chỉ vẽ được 1 hình ảnh lên canvas. Do đó phải sử dụng canvas phụ tempCanvas
						tempContext.globalCompositeOperation = "source-in";
						tempContext.fillStyle = colorCode;
						tempContext.fillRect(0, 0, 1500, 1125);
					}

					//Vẽ nội dung của canvas phụ tempCanvas lên canvas chính, để có thể vẽ nhiều image lên 1 canvas.
					context.drawImage(tempContext.canvas, 0, 0);

					//Thiết lập canvas phụ về mặc định, để dùng cho lần vẽ tiếp theo
					tempContext.globalCompositeOperation = "source-over";
					tempContext.clearRect(
						0,
						0,
						tempCanvas.width,
						tempCanvas.height
					);
					resolve("Draw image successfully");
				} catch (error) {
					reject(error);
				}
			});
		};

		//Tạo 2 canvas phục vụ cho việc render hình ảnh và đổ màu
		createCanvas('myCanvas', 1500, 1125)
		createCanvas('tempCanvas', 1500, 1125)

		//Cú pháp dùng để gọi 1 series promise theo thứ tự được khai báo trong 1 Array
		// Code được lấy từ https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
		const serial = funcs =>
			funcs.reduce(
				(promise, func) =>
				promise
				.then(result =>
					func().then(Array.prototype.concat.bind(result))
				)
				.catch(error => Array.prototype.concat.bind(error)),
				Promise.resolve([])
			);

		// console.log($rootScope.genIMG)

		const funcs = $rootScope.genIMG.map(image => () =>
			createImage(image.url)
			.then(img => drawImage(img, image.colorCode))
			.catch(error => console.log(error))
		);

		const funcsCover = $rootScope.genIMG.map(image => () =>
			createImage(image.url_cover)
			.then(img => drawImage(img, ""))
			.catch(error => console.log(error))
		);

		serial(funcs).then(() => {
			serial(funcsCover).then(() => {
				let canvas = document.getElementById("myCanvas");
				let tempCanvas = document.getElementById('tempCanvas')
				let imgBase64 = canvas.toDataURL();

				//Tạo thẻ a để làm trung gian download, ngay khi download sẽ remove khỏi DOM.
				let imageLink = document.createElement("a");
				imageLink.setAttribute("href", imgBase64);
				imageLink.setAttribute("download", "liena-" + Math.floor(Math.random() * 999999) + 99999 + ".png");

				$rootScope.imageSaveBASE64 = imgBase64
				imageLink.style.display = "none";
				document.body.appendChild(imageLink);
				imageLink.click();
				document.body.removeChild(imageLink);

				//Remove 2 canvas ra khỏi cây DOM
				document.body.removeChild(canvas);
				document.body.removeChild(tempCanvas);
			});
		});
	}

	$scope.shareImage = function () {
		let dataToOrder = {
			productId: parseInt($scope.CAT_URL),
			pat: ($rootScope.dataPat).toString()
		}
		let newsFullPath = document.URL
		let newsFullPathEncode = encodeURIComponent(newsFullPath)
		window.location.href = "https://www.facebook.com/sharer/sharer.php?u=" + newsFullPathEncode + "&src=sdkpreparse"
	}
	$scope.order = function () {
			let dataToOrder = {
				image: $rootScope.imageSaveBASE64,
				productId: parseInt($scope.CAT_URL),
				pat: ($rootScope.dataPat).toString()
			}
			// console.log($rootScope.dataPat)

			$http({
				method: 'POST',
				url: baoNguyenApp.API.URL + baoNguyenApp.API.save,
				data: dataToOrder
			}).then(function (response) {
				if (response.data.success) {
					window.location.href = response.data.cartpageurl;
				}
			}, function (error) {
				console.log('Lỗi Save: ' + error);
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
		$scope.ctrlClickHandler($scope.menus[0].id, 0)

		if ($scope.PA_URL && $scope.PA_URL != 'undefined') {
			$rootScope.dataPat = $scope.PA_URL.split(",")
			var empIds = $scope.PA_URL.split(",")
			for (let index = 0; index < empIds.length; index++) {
				$http({
					method: 'GET',
					url: baoNguyenApp.API.URL + baoNguyenApp.API.material + "?id=" + $scope.menus[index].id
				}).then(function (data) {
					$scope.data = eval(data.data.lists);
					var filteredArray = $scope.data.filter(function (itm) {
						return empIds.indexOf('' + itm.id + '') > -1;
					});
					getPat(filteredArray, index, filteredArray[0] ? filteredArray[0].id : null, $rootScope)
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
		if($rootScope.index  == 3) {
			$rootScope.dataPat[4] = null
		} else if($rootScope.index  == 4) {
			$rootScope.dataPat[3] = null
		}
		getPat(newArray, $rootScope.index, e, $rootScope)
	}, function (error) {
		console.log('Lỗi Data: ' + error);
	});
	$scope.showloadingmaterial = false
}

function getPat(newArray, e, m, $rootScope) {

	$rootScope.dataPat[e] = m

	
	if(($rootScope.dataPat[e] == null && e == 3) || ($rootScope.dataPat[e] == null && e == 4)) {
		$rootScope.dataPat[e] = m
	}


	if (e == 0) {
		$('.blockprodis-nem .nem').css({
			"background-color": newArray[0].color[0]
		})
	} else if (e == 1) {
		$('.blockprodis-goi .goi').css({
			"background-color": newArray[0].color[0]
		})
	} else if (e == 2) {
		$('.blockprodis-goiom .goiom').css({
			"background-color": newArray[0].color[0]
		})
	} else if (e == 3) {
		if($rootScope.dataPat[e] != null) {
			$('.blockprodis-men-b .men-b').css({
				"background-color": newArray[0].color[0]
			})
			$('.blockprodis-men-f .men-f').css({
				"background-color": newArray[0].color[0]
			})
		}
	} else {
		if($rootScope.dataPat[e] != null) {
			$('.blockprodis-men-b .men-b').css({
				"background-color": newArray[0].color[1]
			})
			$('.blockprodis-men-f .men-f').css({
				"background-color": newArray[0].color[0]
			})
		}
	}


	if (e == 0) {
		$rootScope.genIMG[e] = {}
		$rootScope.genIMG[e].colorCode = newArray[0].color[0]
		$rootScope.genIMG[e].url = "./img/nem-w.png"
		$rootScope.genIMG[e].url_cover = "./img/nem-s.png"
		$rootScope.genIMG[e].index = e
	} else if (e == 1) {
		$rootScope.genIMG[e] = {}
		$rootScope.genIMG[e].colorCode = newArray[0].color[0]
		$rootScope.genIMG[e].url = "./img/goi-w.png"
		$rootScope.genIMG[e].url_cover = "./img/goi-s.png"
		$rootScope.genIMG[e].index = e

	} else if (e == 2) {
		$rootScope.genIMG[e] = {}
		$rootScope.genIMG[e].colorCode = newArray[0].color[0]
		$rootScope.genIMG[e].url = "./img/goiom-w.png"
		$rootScope.genIMG[e].url_cover = "./img/goiom-s.png"
		$rootScope.genIMG[e].index = e

	} else if (e == 3) {
		if($rootScope.dataPat[e] != null) {
			$rootScope.genIMG[3] = {}
			$rootScope.genIMG[4] = {}
			$rootScope.genIMG[3].colorCode = newArray[0].color[0]
			$rootScope.genIMG[3].url = "./img/men-b-w.png"
			$rootScope.genIMG[3].url_cover = "./img/men-b-s.png"
			$rootScope.genIMG[3].index = 3
			$rootScope.genIMG[4].colorCode = newArray[0].color[0]
			$rootScope.genIMG[4].url = "./img/men-f-w.png"
			$rootScope.genIMG[4].url_cover = "./img/men-f-s.png"
			$rootScope.genIMG[4].index = 4
		}
	} else {
		if($rootScope.dataPat[e] != null) {
			$rootScope.genIMG[3] = {}
			$rootScope.genIMG[4] = {}
			$rootScope.genIMG[3].colorCode = newArray[0].color[1]
			$rootScope.genIMG[3].url = "./img/men-b-w.png"
			$rootScope.genIMG[3].url_cover = "./img/men-b-s.png"
			$rootScope.genIMG[3].index = 3
			$rootScope.genIMG[4].colorCode = newArray[0].color[0]
			$rootScope.genIMG[4].url = "./img/men-f-w.png"
			$rootScope.genIMG[4].url_cover = "./img/men-f-s.png"
			$rootScope.genIMG[4].index = 4
		} 
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
		sURLVariables = sPageURL.replace(/%2C/g, ",").split(/[&||?]/),
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
