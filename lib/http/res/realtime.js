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
			$http.post("/manage/room/get/", $scope.buildParam({})).success(function (data, status, headers, config) {
				$scope.roomList = data;
			});
			registerInit.push(function () {
				$http.post("/manage/config/password/get/", $scope.buildParam({})).success(function (data, status, headers, config) {
					$scope.config = data;
					socket = io(location.origin);
					console.log($scope.config);
					socket.emit("password", {
						password: $scope.config.connectpassword,
						room: $scope.room, 
						info: {
							version: serverVersion
						}
					});
					socket.on("connected", function() {
						$scope.connectToServer = true;
					});
				});
			});
		}
	);

	return realtime;
})();
