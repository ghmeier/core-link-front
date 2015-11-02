angular.module('corelink.controllers').controller("LoginController", function($rootScope, $scope, $location, HttpService){

	var checkUsername = function(promptString, callback) {
		var username = prompt(promptString, "");
		if(username=="") {
			callback(null);
		} else {
			HttpService.getRequest($rootScope.path+"/fleet/new"+"?name="+username, function(err, data) {
				if(!err) {
					callback(data);
				} else {
					//If the user exists, pull their data from the server
					HttpService.getRequest($rootScope.path + "/fleet?name=" + username, function(err, data)
					{
						if(!err)
						{
							callback(data);
						}
						else
						{
							callback(null);
						}
					});
				}
			});
		}
	}



	var checkUsernameStorage = function() {
		// console.log(localStorage.getItem("core-link-username"));
		// localStorage.setItem("core-link-username", "null");
		if($rootScope.fleet == null) {
			var username = localStorage.getItem("core-link-username");
			if(username == null || username == "null") {
				
				//Create new fleet
				checkUsername("Thanks for trying out Core-Link, please enter your username", function(fleetData) {
					if(fleetData !== null) {
						localStorage.setItem("core-link-username", fleetData.name);
						$rootScope.fleet = fleetData;
						$location.path("/fleet");
						
					} else {
						$location.path("/user-error");
					}
				});
				
			} else {
				//Set root username
			
				HttpService.getRequest($rootScope.path+"/fleet"+"?name="+username, function(err, data) {
					if(!err) {
						$rootScope.fleet = data;
						$location.path("/fleet");
					} else {
						//Removing
						localStorage.setItem("core-link-username", "null");
						checkUsernameStorage();
					}
				});
			}
		} else {
			$location.path("/fleet");
		}
	}

	checkUsernameStorage();

})