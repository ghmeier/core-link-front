angular.module('corelink.controllers').controller("MainController", function($rootScope, $scope, $location, HttpService){

	var checkUsername = function(promptString, callback) {
		var username = prompt(promptString, "");
		if(username=="") {
			callback(null);
		} else {
			HttpService.getRequest($rootScope.path+"/fleet/new"+"?name="+username, function(err, data) {
				if(!err) {
					callback(username);
				} else {
					checkUsername("Sorry, that username was already taken, try again", function(username) {
						callback(username)
					});
				}
			});
		}
	}

	var getFleetId = function() {
		HttpService.getRequest($rootScope.path+"/fleet?name=" + $rootScope.username, function(err, data) {
			$rootScope.fleet.id = data.id;
		});
	}

	var checkUsernameStorage = function() {
		if($rootScope.username === "") {
			var username = localStorage.getItem("core-link-username");

			if(typeof username == 'underfined' || username === null) {
				console.log("no local storage found");
				//Create new fleet
				checkUsername("Thanks for trying out Core-Link, please enter your username", function(username) {
					if(username !== null) {
						localStorage.setItem("core-link-username", username);
						$rootScope.username = username;
						getFleetId();
					} else {
						$location.path("/user-error");
					}
				});
				
			} else {
				//Set root username
				localStorage.setItem("core-link-username", username);
				$rootScope.username = username;
				getFleetId();
			}
		} 
	}

	checkUsernameStorage();

})