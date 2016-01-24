/// <reference path="../../../typings/angularjs/angular.d.ts"/>
var realtime = (function () {
	var realtime = angular.module("danmu.realtime", [
		"ui.bootstrap",
		"realtimeControllers"
	]);
	var realtimeControllers = angular.module('realtimeControllers', []);
	var registerInit = []; // 用于初始化回调
	var socket = null;

	// alternatively, register the interceptor via an anonymous factory

	realtime.config(['$httpProvider',
		function ($httpProvider) {
			$httpProvider.interceptors.push(function ($q, $rootScope) {
				return {
					'responseError': function (response) {
						$rootScope.err.code = response.status;
						$rootScope.err.desc = response.data.error;
						$rootScope.haveError = true;
						return $q.reject(response);
					},
					'response': function (response) {
						$rootScope.err.code = response.status;
						$rootScope.err.desc = "";
						$rootScope.haveError = false;
						return response;
					}
				};
			});
		}
	]);

	realtimeControllers.controller("MainCtrl",
		function ($scope, $http, $rootScope) {
			$scope.accordion = {
				openInfo: true,
			};
			$scope.isLogin = false;
			$scope.connectToServer = false;
			$scope.room = "";
			$scope.password = "";
			$scope.danmus = [];
			$scope.config = null;
			$rootScope.haveError = false;
			$rootScope.err = {
				code: 200,
				desc: ""
			};

			$scope.initRoom = function (room) {
				$scope.room = room;
			};
			$scope.enterRoom = function (password) {
				$scope.password = password;
				for (var object in registerInit) registerInit[object].call();
				$scope.isLogin = true;
				$scope.accordion.openInfo = false;
			};
			$scope.buildParam = function (object) {
				object.room = $scope.room;
				object.password = $scope.password;
				return object;
			};
			$scope.deleteDanmu = function ($index, id, blockHash) {
				$http.post("/manage/danmu/delete/", $scope.buildParam({
					id: id,
					hash: blockHash
				})).success(function (data, status, headers, config) {
					if ($scope.danmus[$index]) {
						if ($scope.danmus[$index].id == id) {
							$scope.danmus[$index].lifeTime = 0;
						}
					}
				});
			};

			$http.post("/manage/room/get/", $scope.buildParam({})).success(function (data, status, headers, config) {
				$scope.roomList = data;
			});
			registerInit.push(function () {
				$http.post("/manage/config/password/get/", $scope.buildParam({})).success(function (data, status, headers, config) {
					$scope.config = data;
					socket = io(location.origin);
					socket.emit("password", {
						password: $scope.config.connectpassword,
						room: $scope.room,
						info: {
							version: serverVersion
						}
					});
					socket.on("connected", function () {
						$scope.connectToServer = true;
					});
					socket.on("danmu", function (data) {
						data.data.forEach(function (value) {
							value.socketId = value.id + "-" + socket.id;
							value.lifeTime = parseInt(value.lifeTime);
							$scope.danmus.push(value);
						});
						$scope.$apply();
					});
					setInterval(function () {
						var isRemoved = false;
						$scope.danmus.forEach(function (value, key) {
							value.lifeTime -= 60;
							if (value.lifeTime <= 0) {
								$scope.danmus.splice(key, 1);
								isRemoved = true;
							}
						});
						if (isRemoved) {
							$scope.$apply();
						}
					}, 1000); // auto remove 60fps
				});
			});
		}
	);

	return realtime;
})();
