angular.module('corelink.controllers').controller("FleetController", function($rootScope, $scope, $location, $timeout, HttpService){

	$scope.planet = {};
	$scope.resourceList = {};
	$scope.currentTime = new Date().getTime();

	$scope.incrementResource = function(type, mod, abundance) {
		var old_amount = parseFloat( $scope.resourceList[type].amount);
		var new_amount = mod * abundance;
		new_amount = Math.round(new_amount * 10) / 10;
		$scope.resourceList[type].amount = (old_amount + new_amount).toFixed(1);
		$rootScope.fleet.resources[type] = old_amount + new_amount;
		var new_time = new Date().getTime();
		
		if(new_time - $scope.currentTime >= 5000) {
			console.log($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update");
			console.log(JSON.stringify($rootScope.fleet));
			$scope.currentTime = new_time;
			HttpService.postRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update", $rootScope.fleet, function(err, data) {
				
			});
		}		
	}

	var setPlanetSize = function() {
		switch($scope.planet.size) {
		    case 0:
		        $scope.planet["sizeString"] = "Small";
		        break;
		    case 1:
		        $scope.planet["sizeString"] = "Small-Medium";
		        break;
		    case 2:
		        $scope.planet["sizeString"] = "Medium";
		        break;
		    case 3:
		        $scope.planet["sizeString"] = "Medium-Large";
		        break;
		    case 4:
		        $scope.planet["sizeString"] = "Large";
		        break;
		}
	}

	var createResourceList = function() {
		var planetResLength = ($scope.planet.resources).length
		for(key in $rootScope.fleet.resources) {
			var val = $rootScope.fleet.resources[key];
			$scope.resourceList[key] = {"amount" : val.toFixed(1), "harvest" : false};
			for(var i = 0; i < planetResLength; i++) {
				if($scope.planet.resources[i].type === key) {
					$scope.resourceList[key].harvest = true; 
					$scope.resourceList[key]["abundance"] = $scope.planet.resources[i].abundance; 
					$scope.resourceList[key]["mod"] = $scope.planet.resources[i].mod; 
					break;
				}
			}
		}
	}

	var getPlanetInfo = function() {

		HttpService.getRequest($rootScope.path+"/planet/"+$rootScope.fleet.current_planet, function(err, data) {
			if(!err) {
				$scope.planet = data;
				setPlanetSize();
				createResourceList();
			}

		});
	}

	//If they arent logged in, log them in
	if($rootScope.fleet === null) {
		$location.path("/");
	} else {
		getPlanetInfo();
	}
});