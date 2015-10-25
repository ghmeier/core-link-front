angular.module('corelink.controllers').controller("MainController", function($scope,$http){
	$http.get("http://localhost:3000/ping")
		.success(function(data){
			$scope.pong = data.data;
			console.log(data);
		})
		.error(function(data){
			console.log("Error: "+ data);
		});

})