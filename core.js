'use strict';

angular.module('CoreService', [])
	.factory('Service', ['$q', '$resource', 'ApiHostname', function($q, $resource, ApiHostname) {
		return function(location, data, actions) {
			var canceler = $q.defer();

			var defaultActions = {
				update: {
					method: 'PUT',
					timeout: canceler.promise
				},
				get: {
					method: 'GET',
					timeout: canceler.promise
				},
				remove: {
					method: 'DELETE',
					timeout: canceler.promise
				},
				query: {
					method: 'GET',
					isArray: true,
					timeout: canceler.promise
				}
			};

			var url = ApiHostname + '/'+location;

			actions = $.extend(defaultActions, actions);
			var Request = $resource(url, data, actions);

			return {
				url: url,
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
				find: function(query, successCallback, errorCallback) {
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
				 * ***DEPRECATED***
				 *
				 * Alias for findById
				 */
				findByPk: function(id, successCallback, errorCallback) {
					return this.findById(id, successCallback, errorCallback);
				},

				/**
				 * AppVariants.findById(1)
				 * AppVariants.findById(1, function() { alert('done'); });
				 *
				 * @param id string The identifier to request
				 * @param successCallback This callback is called after data requested ended up with a HTTP 20x
				 * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
				 * @returns $resource object
				 */
				findById: function(id, successCallback, errorCallback) {
					return this.find({id:id}, successCallback, errorCallback);
				},

				/**
				 * AppVariants.delete(1)
				 * AppVariants.delete(1, function() { alert('done'); }, function() { alert('error') });
				 * AppVariants.delete({id: 1}, function() { alert('done'); }, function() { alert('error') });
				 * AppVariants.delete(function() { alert('done'); }, function() { alert('error') });
				 *
				 * Alias for remove
				 */
				delete: function(query, successCallback, errorCallback) {
					return this.remove(query, successCallback, errorCallback);
				},

				/**
				 * AppVariants.remove(1)
				 * AppVariants.remove(1, function() { alert('done'); }, function() { alert('error') });
				 * AppVariants.remove({id: 1}, function() { alert('done'); }, function() { alert('error') });
				 * AppVariants.remove(function() { alert('done'); }, function() { alert('error') });
				 *
				 * @param id string Enter the primary key
				 * @param successCallback This callback is called after data requested ended up with a HTTP 20x
				 * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
				 * @returns $resource object
				 */
				remove: function(query, successCallback, errorCallback) {
					var getType = {};
					if(query && getType.toString.call(query) === '[object Function]') {
						successCallback = query;
						errorCallback = successCallback;
						query = undefined;
					}
					else if(query && getType.toString.call(query) !== '[object Object]') {
						query = {id: query};
					}

					return Request.remove(query, successCallback, errorCallback);
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
					if (data.id === undefined) {
						return this.create(data, successCallback, errorCallback);
					}
					else {
						return this.update(data, successCallback, errorCallback);
					}
				},

				/**
				 * AppVariants.create({name: 'Mr. Dinges'})
				 * AppVariants.create({name: 'Mr. Dinges'}, function() { alert('done'); });
				 *
				 * @param data object An object with the data you want to save
				 * @param successCallback This callback is called after data requested ended up with a HTTP 20x
				 * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
				 * @returns $resource object
				 */
				create: function(data, successCallback, errorCallback) {
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
				},

				cancelRequest: function() {
					return canceler.resolve();
				}
			};
		};
	}]);
