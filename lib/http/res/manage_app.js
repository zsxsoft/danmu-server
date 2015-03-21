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
		}
	]);
	manageControllers.controller("DanmuCtrl", ['$scope', '$http',
		function($scope, $http) {
			$scope.danmu = {};
			$scope.danmu.searchKey = "";
			$scope.danmu.doSearch = function() {
				$http.post("/manage/search", {
					key: $scope.danmu.searchKey,
					room: $scope.room, // 测试房间
					password: $scope.password //测试密码
				}).success(function(data, status, headers, config) {
					$scope.danmu.result = data;
				});
			};
			$scope.danmu.checkKeyDown = function(e) {
				if (e.keyCode == 13) this.doSearch();
			}
		}
	]);
	return manage;
})();