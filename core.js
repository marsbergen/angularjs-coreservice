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
        patch: {
          method: 'PATCH',
          timeout: canceler.promise
        }
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

      var url = ApiHostname + '/' + location;

      actions = $.extend(defaultActions, actions);
      var Request = $resource(url, data, actions);

      return {
        url: url,
        /**
         * AppVariants.find({id: 1})
         * AppVariants.find({id: 1}, function() { alert('done'); });
         * AppVariants.find(function() { alert('done'); });
         *
         * @description Expects HTTP request to respond with Json Object in HTTP Response Body
         * @param query object|callback Enter the query string or the successCallback
         * @param successCallback This callback is called after data requested ended up with a HTTP 20x
         * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
         * @returns $resource object
         * @example [GET] apiHost.ext/location
         * @example [GET] apiHost.ext/location?{query}={string}
         */
        find: function find (query, successCallback, errorCallback) {
          // Check if given query is a function and no successCallback was given.
          // If so the query will be the callBack and there won't be a real query
          var getType = {};
          if(successCallback === undefined && !!query && getType.toString.call(query) === '[object Function]')
          {
            successCallback = query;
            errorCallback = successCallback;
            query = undefined;
          }

          var callback = function(data, responseHeaders) {
            if(!!successCallback)
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
         * @description Expects HTTP request to respond with Json Array in HTTP Response Body
         * @param query object|callback Enter the query string or the successCallback
         * @param successCallback This callback is called after data requested ended up with a HTTP 20x
         * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
         * @returns $resource array
         * @example [GET] apiHost.ext/location
         * @example [GET] apiHost.ext/location?{query}={string}
         */
        findAll: function findAll (query, successCallback, errorCallback) {
          // Check if given query is a function and no successCallback was given.
          // If so the query will be the callBack and there won't be a real query
          var getType = {};
          if(!!query && getType.toString.call(query) === '[object Function]')
          {
            successCallback = query;
            errorCallback = successCallback;
            query = undefined;
          }

          return Request.query(query, successCallback, errorCallback);
        },

        /**
         * AppVariants.findById(1)
         * AppVariants.findById(1, function() { alert('done'); });
         *
         * @param id string The identifier to request
         * @param successCallback This callback is called after data requested ended up with a HTTP 20x
         * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
         * @returns $resource object
         * @example [GET] apiHost.ext/location/{id}
         */
        findById: function findById (id, successCallback, errorCallback) {
          return this.find({id:id}, successCallback, errorCallback);
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
         * @example [DELETE] apiHost.ext/location
         * @example [DELETE] apiHost.ext/location?{query}={string}
         */
        remove: function remove (query, successCallback, errorCallback) {
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
         * AppVariants.delete(1)
         * AppVariants.delete(1, function() { alert('done'); }, function() { alert('error') });
         * AppVariants.delete({id: 1}, function() { alert('done'); }, function() { alert('error') });
         * AppVariants.delete(function() { alert('done'); }, function() { alert('error') });
         *
         * @alias this.remove
         */
        delete: function delete (query, successCallback, errorCallback) {
          return this.remove(query, successCallback, errorCallback);
        },

        /**
         * AppVariants.save({name: 'Mr. Dinges'})
         * AppVariants.save({name: 'Mr. Dinges'}, function() { alert('done'); });
         *
         * @param data object An object with the data you want to save
         * @param successCallback This callback is called after data requested ended up with a HTTP 20x
         * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
         * @returns $resource object
         * @alias this.create if no 'id' attribute is detected in the data object
         * @alias this.update if an 'id' attribute is detected in the data object
         */
        save: function save (data, successCallback, errorCallback) {
          if (!!data.id) {
            return this.update(data, successCallback, errorCallback);
          }
          
          return this.create(data, successCallback, errorCallback);
        },

        /**
         * AppVariants.create({name: 'Mr. Dinges'})
         * AppVariants.create({name: 'Mr. Dinges'}, function() { alert('done'); });
         *
         * @param data object An object with the data you want to save
         * @param successCallback This callback is called after data requested ended up with a HTTP 20x
         * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
         * @returns $resource object
         * @example [POST] apiHost.ext/location {request: body}
         */
        create: function create (data, successCallback, errorCallback) {
          var request = new Request(data);
          return request.$save(successCallback, errorCallback);
        },

        /**
         * AppVariants.post({name: 'Mr. Dinges'})
         * AppVariants.post({name: 'Mr. Dinges'}, function() { alert('done'); });
         *
         * @alias this.create
         */
        post: function post (data, successCallback, errorCallback) {
          return this.save(data, successCallback, errorCallback);
        },

        /**
         * AppVariants.update({id: 1, name: 'Mr. Bojangles'})
         * AppVariants.update({id: 1, name: 'Mr. Bojangles'}, function() { alert('done'); });
         *
         * @param data object An object with the data you want to update
         * @param successCallback This callback is called after data requested ended up with a HTTP 20x
         * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
         * @returns $resource object
         * @example [PUT] apiHost.ext/location {request: body}
         */
        update: function update (data, successCallback, errorCallback) {
          return Request.update(data, successCallback, errorCallback);
        },

        /**
         * AppVariants.put({id: 1, name: 'Mr. Bojangles'})
         * AppVariants.put({id: 1, name: 'Mr. Bojangles'}, function() { alert('done'); });
         *
         * @alias this.update
         */
        put: function put (data, successCallback, errorCallback) {
          return this.update(data, successCallback, errorCallback);
        },

        /**
         * AppVariants.patch({id: 1, name: 'Mr. Bojangles'})
         * AppVariants.patch({id: 1, name: 'Mr. Bojangles'}, function() { alert('done'); });
         *
         * @param data object An object with the data you want to patch
         * @param successCallback This callback is called after data requested ended up with a HTTP 20x
         * @param errorCallback This callback is called after data requested ended up with another HTTP than 20x
         * @returns $resource object
         * @example [PATCH] apiHost.ext/location {request: body}
         */
        patch: function patch (data, successCallback, errorCallback) {
          return Request.patch(data, successCallback, errorCallback);
        },

        /** 
         * @description Will cancel the request that is in progress
         */
        cancelRequest: function cancelRequest () {
          return canceler.resolve();
        }
      };
    };
  }]);
