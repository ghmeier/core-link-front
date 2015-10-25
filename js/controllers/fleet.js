angular.module('corelink.controllers').controller("FleetController", function($rootScope, $scope, $location, $timeout, HttpService){

	$scope.planet = {};
	$scope.updateProgress = 0;
	$scope.updateProgressMax = 0;
	$scope.resourceList = {};
	$scope.upgrades = {};
	$scope.upgradeIds = {};
	$scope.currentTime = new Date().getTime();
	$scope.harvestingTimer = new Date().getTime();
	$scope.harvestingCarry = 0;

	var updateHarvesters = function(callback) {
		var old_time = $scope.harvestingTimer;
		var new_time = new Date().getTime();
		var total = 0;
		for(var ship in $rootScope.fleet.ships) {
			for(var harvestor in $rootScope.fleet.ships[ship].harvesters) {
				var harv = $rootScope.fleet.ships[ship].harvesters[harvestor];
				var amount = harv.multiplier * harv.speed;
				var time_difference = (new_time - old_time)/1000;
				total += Math.abs((amount * time_difference) / 1000);
			}
		}
		$scope.harvestingTimer = new_time;
		$rootScope["autoHarv"] = total.toFixed(4);
		$scope.harvestingCarry += total;
		//$rootScope.fleet.fuel = (parseFloat( $rootScope.fleet.fuel) + total).toFixed(1);
	}

	var renewFleet = function() {
		
		HttpService.getRequest($rootScope.path+"/fleet"+"?name="+$rootScope.fleet.name, function(err, data) {
			if(!err) {
				$rootScope.fleet = data;

			}
		});
	}

	var getObjectLength = function(object) {
		
		var count = 0;
		var i;

		for (i in object) {
		    if (object.hasOwnProperty(i)) {
		        count++;
		    }
		}
		return count;
	}

	$scope.incrementResource = function(type, mod, abundance) {
		updateHarvesters(function(){});
		var old_amount = parseFloat( $scope.resourceList[type].amount);
		var new_amount = mod * abundance;
		new_amount = Math.round(new_amount * 10) / 10;
		$scope.resourceList[type].amount = (old_amount + new_amount).toFixed(1);
		$rootScope.fleet.resources[type] = old_amount + new_amount;
		var new_time = new Date().getTime();

		if(new_time - $scope.currentTime >= 5000) {
			$scope.currentTime = new_time;
			$rootScope.fleet.fuel = (parseFloat( $rootScope.fleet.fuel) + $scope.harvestingCarry).toFixed(1);
			$scope.harvestingCarry = 0;
			HttpService.postRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update", $rootScope.fleet, function(err, data) {

			});
		}
	}

	$scope.incrementFuel = function() {
		updateHarvesters(function(){});
		var ur = (parseFloat($scope.resourceList["uranium"].amount)+1) *3;
		var co = (parseFloat($scope.resourceList["coal"].amount)+1) * 2;
		var am = (parseFloat($scope.resourceList["oil"].amount)+1) * 1;

		var amount = (ur + co + am) / 4;
		amount = Math.round(amount * 10) / 10;
		$rootScope.fleet.fuel = (parseFloat($rootScope.fleet.fuel) + amount).toFixed(1);
		var new_time = new Date().getTime();

		if(new_time - $scope.currentTime >= 5000) {
			$scope.currentTime = new_time;
			$rootScope.fleet.fuel = (parseFloat( $rootScope.fleet.fuel) + $scope.harvestingCarry).toFixed(1);
			$scope.harvestingCarry = 0;
			HttpService.postRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update", $rootScope.fleet, function(err, data) {});
		}
	}

	$scope.searchPlanet = function() {
		updateHarvesters(function(){});
		var amountOfFuel = $rootScope.fleet.fuel * 10;
		var name = prompt("What shall this new planet be named:", "");
		if(name == null || name == "") return null;
		console.log($rootScope.path+"/planet/new?name="+name+"&discoverer="+$rootScope.fleet.name+"&parentId="+$scope.planet.id+"&fuel="+amountOfFuel);
		HttpService.getRequest($rootScope.path+"/planet/new?name="+name+"&discoverer="+$rootScope.fleet.name+"&parentId="+$scope.planet.id+"&fuel="+amountOfFuel, function(err, data) {
			if(err) {
				alert("Oh No, nothing was found. Looks like " + name + " will have to wait another day");
				$rootScope.fleet.fuel = 0;
			} else {

				alert("Welcome to the newly discovered planet " + name);
				$rootScope.fleet.current_planet = data.id;
				$rootScope.fleet.fuel = 0;
				$scope.planet = {};
				$scope.updateProgress = 0;
				$scope.updateProgressMax = 0;
				$scope.resourceList = {};
				$scope.upgrades = {};
				$scope.upgradeIds = {};
				renewFleet();
				getPlanetInfo();
				getUpgrades();
			}
			$rootScope.fleet.fuel = (parseFloat( $rootScope.fleet.fuel) + $scope.harvestingCarry).toFixed(1);
			$scope.harvestingCarry = 0;
			HttpService.postRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update", $rootScope.fleet, function(err, data) {});
		});
	}

	$scope.getNeighborChoice = function(options, print) {
		
		var choice = prompt(print, "");
		if(choice == null || choice == "null" | choice == "") return null;
		if(!options[choice]) return $scope.getNeighborChoice(options, print);
		return options[choice];
	}

	$scope.neighborPlanet = function() {
		updateHarvesters(function(){});
		var options = {};
		var printed = "Enter the number of the planet you would like to visit: \n\n";
		var count = 1;

		for(var key in $scope.planet.connections) {
			if($scope.planet.connections[key].weight * 10 <= $rootScope.fleet.fuel) {
				printed += "( "+(count)+" ) Costs " + ($scope.planet.connections[key].weight * 10).toFixed(1) + " lbs of fuel.\n";
				options[(count)] = $scope.planet.connections[key];
				count++;
			}
		}

		if(getObjectLength(options) <= 0) {
			alert("You cannot reach any planet nearby");
		} else {
			var choice = $scope.getNeighborChoice(options, printed);
			if(choice!=null) {
				$rootScope.fleet.current_planet = choice.id;
				$rootScope.fleet.fuel -= (choice.weight*10);
				$rootScope.fleet.fuel = (parseFloat( $rootScope.fleet.fuel) + $scope.harvestingCarry).toFixed(1);
				$scope.harvestingCarry = 0;
				HttpService.postRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update", $rootScope.fleet, function(err, data) {});
				$scope.planet = {};
				$scope.updateProgress = 0;
				$scope.updateProgressMax = 0;
				$scope.resourceList = {};
				$scope.upgrades = {};
				$scope.upgradeIds = {};
				renewFleet();
				getPlanetInfo();
				getUpgrades();
				console.log("here");
			}
			console.log(JSON.stringify($scope.planet));
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

	var createFinalUpdateObject = function() {
		
		for(var key in $scope.upgradeIds) {
			$scope.upgradeIds[key].show = false;
			for(var id in $scope.upgradeIds[key]) {
				console.log(JSON.stringify($scope.upgrades.planet[id]));
				$scope.upgradeIds[key][id] = $scope.upgrades.planet[id];
				if(typeof $scope.planet.upgrades !== 'undefined' && typeof $scope.planet.upgrades[id] !== 'undefined') {
					var level = $scope.planet.upgrades[id].level;

					for(var item in $scope.upgradeIds[key][id].cost) {
						$scope.upgradeIds[key][id].cost[item] = ($scope.upgradeIds[key][id].cost[item] * Math.pow($scope.upgradeIds[key][id].cost_multiplier, level));
					}

					for(var item in $scope.upgradeIds[key][id].result) {
						$scope.upgradeIds[key][id].cost[item] = ($scope.upgradeIds[key][id].cost[item] * Math.pow($scope.upgradeIds[key][id].result_multiplier, level));
					}
				}
			}
		}
	}

	var updateProgress = function() {
		
		$scope.updateProgress++;
		if($scope.updateProgress >= $scope.updateProgressMax) {
			createFinalUpdateObject();
			$scope.updateProgress = 0;
			$scope.updateProgressMax = 0;
		}
	}

	var getUpgradeIds = function() {
		
		var planetResLength = ($scope.planet.resources).length
		$scope.updateProgressMax += planetResLength;
		for(var i = 0; i < planetResLength; i++) {
			HttpService.getRequest($rootScope.path+"/upgrades/planet/find/"+$scope.planet.resources[i].type, function(err, data) {
				if(!err) {

					$scope.upgradeIds[data.type] = data.ids;
				}
				updateProgress();
			});
		}
	}

	var getPlanetInfo = function() {
		
		HttpService.getRequest($rootScope.path+"/planet/"+$rootScope.fleet.current_planet, function(err, data) {
			if(!err) {
				$scope.planet = data;
				setPlanetSize();
				createResourceList();

				getUpgradeIds();
			}

		});
	}

	var getUpgrades = function() {
		
		$scope.updateProgressMax += 3;
		HttpService.getRequest($rootScope.path+"/upgrades/fleet", function(err, data) {
			if(!err) {
				$scope.upgrades["fleet"] = data;
			}
			updateProgress();
		});

		HttpService.getRequest($rootScope.path+"/upgrades/planet", function(err, data) {
			if(!err) {
				$scope.upgrades["planet"] = data;
			}
			updateProgress();
		});

		HttpService.getRequest($rootScope.path+"/upgrades/ship", function(err, data) {
			if(!err) {
				$scope.upgrades["ship"] = data;
			}
			updateProgress();
		});
	}

	$scope.buyUpgrade = function(id) {
		updateHarvesters(function(){});
		HttpService.postRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update", $rootScope.fleet, function(err, data) {
			HttpService.getRequest($rootScope.path+"/planet/"+$scope.planet.id+"/upgrade/"+id+"?fleet_id="+$rootScope.fleet.id, function(err, data) {
				if(err) {
					alert(data);
				} else {
					$scope.planet = {};
					$scope.updateProgress = 0;
					$scope.updateProgressMax = 0;
					$scope.resourceList = {};
					$scope.upgrades = {};
					$scope.upgradeIds = {};
					renewFleet();
					getPlanetInfo();
					getUpgrades();

				}
			});
		});
	}

	$scope.addHarvester = function(ship_position){
		
		HttpService.postRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update", $rootScope.fleet, function(err, data) {
			HttpService.getRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/ships/"+ship_position+"/add_harvester", function(err, data) {
				if(err) {
					alert(data);
				} else {
					$scope.planet = {};
					$scope.updateProgress = 0;
					$scope.updateProgressMax = 0;
					$scope.resourceList = {};
					$scope.upgrades = {};
					$scope.upgradeIds = {};
					$rootScope.fleet = data;
					getPlanetInfo();
					getUpgrades();
				}
			});
		});
	}

	$scope.levelHarvester = function(ship_position,harvester_position){
		
		HttpService.postRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update", $rootScope.fleet, function(err, data) {
			HttpService.getRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/ships/"+ship_position+"/harvesters/"+harvester_position+"/level", function(err, data) {
				if(err) {
					alert(data);
				} else {
					$scope.planet = {};
					$scope.updateProgress = 0;
					$scope.updateProgressMax = 0;
					$scope.resourceList = {};
					$scope.upgrades = {};
					$scope.upgradeIds = {};
					$rootScope.fleet = data;
					getPlanetInfo();
					getUpgrades();
				}
			});
		});
	}

	$scope.buyShip = function(){
		
		$rootScope.fleet.fuel = (parseFloat( $rootScope.fleet.fuel) + $scope.harvestingCarry).toFixed(1);
		$scope.harvestingCarry = 0;
		HttpService.postRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/update", $rootScope.fleet, function(err, data) {
			HttpService.getRequest($rootScope.path+"/fleet/"+$rootScope.fleet.id+"/add_ship?type=basic", function(err, data) {
			   if(err) {
					alert(data);
				} else {
					$scope.planet = {};
					$scope.updateProgress = 0;
					$scope.updateProgressMax = 0;
					$scope.resourceList = {};
					$scope.upgrades = {};
					$scope.upgradeIds = {};
					$rootScope.fleet = data;
					getPlanetInfo();
					getUpgrades();
				}
			});
		});
	}

	//If they arent logged in, log them in
	if($rootScope.fleet === null) {
		$location.path("/");
	} else {
		getPlanetInfo();
		getUpgrades();
	}
});