'use strict';

angular.module('CoreService', [])
	.factory('Service', ['$resource', 'ApiHostname', function($resource, ApiHostname) {
		return function(location, data, actions) {
			var defaultActions = {
				update: {
					method: 'PUT'
				},
				get: {
					method: 'GET'
				},
				delete: {
					method: 'DELETE'
				},
				query: {
					method: 'GET',
					isArray: true
				}
			};

			actions = $.extend(defaultActions, actions);
			var Request = $resource(ApiHostname + '/'+location, data, actions);

			return {
				/**
				 * AppVariants.find({id: 1})
				 * AppVariants.find({id: 1}, function() { alert('done'); });
				 * AppVariants.find(function() { alert('done'); });
				 *
				 * @param query object|callback Enter the query string or the successCallback
				 * @param successCallback This callback is called after data requested ended up with a HTTP 20x
				 * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
				 * @returns $resource object
				 */
				find: function(query, successCallback) {
					// Check if given query is a function and no successCallback was given.
					// If so the query will be the callBack and there won't be a real query
					var getType = {};
					if(successCallback === undefined && query && getType.toString.call(query) === '[object Function]')
					{
						successCallback = query;
						errorCallback = successCallback;
						query = undefined;
					}

					var callback = function(data, responseHeaders) {
						if(successCallback !== undefined)
						{
							successCallback(data, responseHeaders);
						}
					};

					return Request.get(query, callback, errorCallback);
				},

				/**
				 * AppVariants.findAll({id: 1})
				 * AppVariants.findAll({id: 1}, function() { alert('done'); });
				 * AppVariants.find(function() { alert('done'); });
				 *
				 * @param query object|callback Enter the query string or the successCallback
				 * @param successCallback This callback is called after data requested ended up with a HTTP 20x
				 * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
				 * @returns $resource array
				 */
				findAll: function(query, successCallback, errorCallback) {
					// Check if given query is a function and no successCallback was given.
					// If so the query will be the callBack and there won't be a real query
					var getType = {};
					if(query && getType.toString.call(query) === '[object Function]')
					{
						successCallback = query;
						errorCallback = successCallback;
						query = undefined;
					}

					return Request.query(query, successCallback, errorCallback);
				},

				/**
				 * AppVariants.findByPk(1)
				 * AppVariants.findByPk(1, function() { alert('done'); });
				 *
				 * @param id string Enter the primary key
				 * @param successCallback This callback is called after data requested ended up with a HTTP 20x
				 * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
				 * @returns $resource object
				 */
				findByPk: function(id, successCallback, errorCallback) {
					return this.find({id:id}, successCallback, errorCallback);
				},

				/**
				 * AppVariants.delete(1)
				 * AppVariants.delete(1, function() { alert('done'); });
				 *
				 * @param id string Enter the primary key
				 * @param successCallback This callback is called after data requested ended up with a HTTP 20x
				 * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
				 * @returns $resource object
				 */
				delete: function(id, successCallback, errorCallback) {
					return Request.delete({id: id}, successCallback, errorCallback);
				},

				/**
				 * AppVariants.save({name: 'Mr. Dinges'})
				 * AppVariants.save({name: 'Mr. Dinges'}, function() { alert('done'); });
				 *
				 * @param data object An object with the data you want to save
				 * @param successCallback This callback is called after data requested ended up with a HTTP 20x
				 * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
				 * @returns $resource object
				 */
				save: function(data, successCallback, errorCallback) {
					var request = new Request(data);
					return request.$save(successCallback, errorCallback);
				},

				/**
				 * AppVariants.update({id: 1, name: 'Mr. Bojangles'})
				 * AppVariants.update({id: 1, name: 'Mr. Bojangles'}, function() { alert('done'); });
				 *
				 * @param data object An object with the data you want to update
				 * @param successCallback This callback is called after data requested ended up with a HTTP 20x
				 * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
				 * @returns $resource object
				 */
				update: function(data, successCallback, errorCallback) {
					return Request.update(data, successCallback, errorCallback);
				}
			};
		};
	}]);
