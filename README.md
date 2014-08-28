# angularjs-coreservice

A base (model) class for services using Angular's Resource module

## Installation

Add the `ApiHostname` as a constant to your AngularJS Application.
The Coreserver depends on this constant.

	angular.module('MyApplication').constant('ApiHostname', 'http://localhost\\:9000/api');


## Usage

### find()

This call is needed when your API result is an object

#### Parameters:
- `query` **object|callback** Enter the query string or recognizes this as successCallback when callback is given
- `successCallback` **callback** This callback is called after data requested ended up with a HTTP 20x
- `errorCallback` **callback** This callback is called after data requested ended up with another HTTP than 20x

#### Returns
`$resource object`

Find with object *(Possible REST Example: [GET] http://url.com/app-variant/1.json?status=active)*

	AppVariants.find({id: 1, status: 'active'}) 

Find with object, successCallback

	AppVariants.find({id: 1, status: 'active'}, function() { alert('done'); });

Find without object and successCallback *(Possible REST Example: [GET] http://url.com/app-variant.json)*

	AppVariants.find(function() { alert('done'); });


### findAll()

This call is needed when your API result is an array

#### Parameters:
- `query` **object|callback** Enter the query string or recognizes this as successCallback when callback is given
- `successCallback` **callback** This callback is called after data requested ended up with a HTTP 20x
- `errorCallback` **callback** This callback is called after data requested ended up with another HTTP than 20x

#### Returns
`$resource object`

FindAll with object *(Possible REST Example: [GET] http://url.com/app-variant.json?query=google)*

	AppVariants.findAll({query: 'google'}) 

Find with object, successCallback

	AppVariants.findAll({query: 'google'}, function() { alert('done'); });

Find without object and successCallback *(Possible REST Example: [GET] http://url.com/app-variant.json)*

	AppVariants.findAll(function() { alert('done'); });
	

### findById()

This call is to do a quicker find call, when you only have an ID to GET

#### Parameters:
- `id` **string** The identifier to request
- `successCallback` **callback** This callback is called after data requested ended up with a HTTP 20x
- `errorCallback` **callback** This callback is called after data requested ended up with another HTTP than 20x

#### Returns
`$resource object`

Find by ID without successCallback *(Possible REST Example: [GET] http://url.com/app-variant/1.json)*

	AppVariants.findById(1)

Find by ID with successCallback *(Possible REST Example: [GET] http://url.com/app-variant/1.json)*

	AppVariants.findById(1, function() { alert('done'); });


### remove()

Do a DELETE call

#### Parameters:
- `query` **string|object|callback** Enter the query string or recognizes this as successCallback when callback is given
- `successCallback` **callback** This callback is called after data requested ended up with a HTTP 20x
- `errorCallback` **callback** This callback is called after data requested ended up with another HTTP than 20x

#### Returns
`$resource object`

Delete by ID *(Possible REST Example: [DELETE] http://url.com/app-variant/1.json)*

	AppVariants.remove(1)

Delete by ID with the callbacks *(Possible REST Example: [DELETE] http://url.com/app-variant/1.json)*

	AppVariants.remove(1, function() { alert('done'); }, function() { alert('error') });

Delete by object with the callbacks *(Possible REST Example: [DELETE] http://url.com/app-variant.json?status=active)*

	AppVariants.remove({status: 'active'}, function() { alert('done'); }, function() { alert('error') });

Delete all with the callbacks *(Possible REST Example: [DELETE] http://url.com/app-variant.json)*

	AppVariants.remove(function() { alert('done'); }, function() { alert('error') });


### delete()

Alias for remove()


### create()

Do a POST call

#### Parameters:
- `query` **object** Enter the query string with data you want to save
- `successCallback` **callback** This callback is called after data requested ended up with a HTTP 20x
- `errorCallback` **callback** This callback is called after data requested ended up with another HTTP than 20x

#### Returns
`$resource object`

Example request:

	[POST] http://url.com/app-variant.json
	
	[REQUEST BODY - application/json] 
	{	
		name: 'Patrick',
		likes: 'github'
	}
	
Post an object to the server 

	AppVariants.create({name: 'Patrick', likes: 'github'})

Post an object to the server with callbacks

	AppVariants.create({name: 'Patrick', likes: 'github'}, function() { alert('done') }, function() { alert('error') })


### update()

Do a PUT call

#### Parameters:
- `query` **object** Enter the query string with data you want to save
- `successCallback` **callback** This callback is called after data requested ended up with a HTTP 20x
- `errorCallback` **callback** This callback is called after data requested ended up with another HTTP than 20x

#### Returns
`$resource object`

Example request:

	[PUT] http://url.com/app-variant/1.json
	
	[REQUEST BODY - application/json] 
	{	
		name: 'Patrick',
		likes: 'github'
	}
	
Post an object to the server 

	AppVariants.update({id: 1, name: 'Patrick', likes: 'github'})

Post an object to the server with callbacks

	AppVariants.update({id: 1, name: 'Patrick', likes: 'github'}, function() { alert('done') }, function() { alert('error') })
	

### save()

Alias for create() and update(). If the given query object has an ID key it will to the update() call, otherwise it will do a create() call

#### Parameters:
- `query` **object** Enter the query string with data you want to save
- `successCallback` **callback** This callback is called after data requested ended up with a HTTP 20x
- `errorCallback` **callback** This callback is called after data requested ended up with another HTTP than 20x