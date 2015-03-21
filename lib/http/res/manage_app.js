var manage = (function() {
	var manage = angular.module("danmu.manage", [
		"ui.bootstrap",
		"manageControllers"
	]);
	var manageControllers = angular.module('manageControllers', []);
	manageControllers.controller("MainCtrl", ['$scope',
		function($scope) {
			$scope.accordion = {
				closeOther: false,
				openDanmu: true,
				openBlock: true,
				openConfig: true
			};
			$scope.room = "default";
			$scope.password = "123456";
			$scope.buildParam = function(object) {
				object.room = $scope.room;
				object.password = $scope.password;
				return object;
			};
		}
	]);
	manageControllers.controller("DanmuCtrl", ['$scope', '$http',
		function($scope, $http) {
			$scope.danmu = {};
			$scope.danmu.searchKey = "";
			$scope.danmu.doSearch = function() {
				$http.post("/manage/search", $scope.buildParam({
					key: $scope.danmu.searchKey,
				})).success(function(data, status, headers, config) {
					$scope.danmu.result = data;
				});
			};
			$scope.danmu.checkKeyDown = function(e) {
				if (e.keyCode == 13) this.doSearch();
			};
		}
	]);
	manageControllers.controller("BlockCtrl", ['$scope', '$http',
		function($scope, $http) {
			$scope.block = {};
			$scope.block.textUser = "";
			$scope.block.doAdd = function() {
				$http.post("/manage/block/add", $scope.buildParam({
					user: $scope.block.textUser,
				})).success(function(data, status, headers, config) {
					$scope.block.result.push($scope.block.textUser);
					$scope.block.textUser = "";
				});
			};
			$scope.block.checkKeyDown = function(e) {
				if (e.keyCode == 13) this.doAdd();
			};
			$scope.block.doRemove = function(user) {
				$http.post("/manage/block/remove", $scope.buildParam({
					user: user,
				})).success(function(data, status, headers, config) {
					$scope.block.result.splice($scope.block.result.indexOf(user), 1);
				});
			};
			$http.post("/manage/block/get/", $scope.buildParam({})).success(function(data, status, headers, config) {
				$scope.block.result = data;
			});
		}
	]);
	manageControllers.controller("ConfigCtrl", ['$scope', '$http',
		function($scope, $http) {
			$scope.config = {};
			$scope.config.realConfig = {};
			$scope.config.realConfig.replaceKeyword = "";
			$scope.config.realConfig.blockKeyword = "";
			$scope.config.realConfig.socketinterval = 0;
			$scope.config.realConfig.socketsingle = 0;
			$scope.config.realConfig.maxlength = 0;
			$scope.config.submitConfig = function() {
				try {
					var regEx1 = new RegExp($scope.config.realConfig.replaceKeyword);
					var regEx2 = new RegExp($scope.config.realConfig.blockKeyword);
					$http.post("/manage/config/set/", $scope.buildParam($scope.config.realConfig)).success(function(data, status, headers, config) {
						$scope.config.realConfig = data;
					});
				} catch(e) {
					alert("正则检测出错！\n\n" + e.toString());
				}
				
			};
			$http.post("/manage/config/get/", $scope.buildParam({})).success(function(data, status, headers, config) {
				$scope.config.realConfig = data;
			});

		}
	]);
	return manage;
})();