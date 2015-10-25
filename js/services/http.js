'use strict';
angular.module('corelink.services').service('HttpService', function($http) {
    
    /*
    *   Get request to host and path that is specified
    */
    this.getRequest = function(path, callback) {
        $http.get(path).success(function (data, status, headers, config) {
            if(data.success) {
              callback(false, data.data);
            } else {
              callback(true, data.message);
            }
        }).error(function (data, status, headers, config) { 

            callback(true, 'Was not able to talk to ' + path);
        });
    }

    /*
    *   Post request to host and path that is specified, json will be sent with request
    */
    this.postRequest = function(path, json, callback) {
        $http.post(path, json).success(function (data, status, headers, config) {
            if(data.success) {
              callback(false, data);
            } else {
              callback(true, data.message);
            }
        }).error(function (data) {
            callback(true, 'Was not able to talk to ' + path);
        });
    };
});