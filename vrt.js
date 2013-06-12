var prototype = require('prototype');

Object.extend(global, prototype);

global.vrt = require('./lib/api');
global.Base = require('./lib/base');

var fs = require('fs'),
	basedir = '/lib/types/base',
	browserdir = '/lib/types/browser';

module.exports.scripts = [
	'/deps/d3.v3.js',
	'/lib/store.js',
	'/lib/stores/clientstore.js',
	'/lib/api.js',
	'/js/viewcontroller.js'
];

var base = fs.readdirSync(__dirname + basedir).sort(),
	browser = fs.readdirSync(__dirname + browserdir).sort().reverse();

module.exports.scripts.push(basedir + '/dataset.js');
module.exports.scripts.push(browserdir + '/dataset.js');

base.forEach(function(path) {
	if(path.indexOf('dataset.js') === -1)
		module.exports.scripts.push(basedir + '/' + path);
});

browser.forEach(function(path) {
	if(path.indexOf('dataset.js') === -1)
		module.exports.scripts.push(browserdir + '/' + path);
});

module.exports.routes = [

	{	
		path:   '/',
		method: 'get',
		secure: false,
		handler: function(req, res) {
			res.send(404);
		}
	},

	{	
		path:   '/api/v1/list',
		method: 'get',
		sessions: false,
		secure: false,
		handler: function(req, res) {
			vrt.list(function(err, list) {
				list = list || {};
				list.error =  err ? err.message : 0;
				res.send(list);
			});
		}
	},

	{	
		path:   '/api/v1/list',
		method: 'post',
		sessions: false,
		secure: false,
		handler: function(req, res) {
			req.accepts('application/json');
			try {
				vrt.list(req.body, function(err, list) {
					list = list || {};
					list.error =  err ? err.message : 0;
					res.send(list);
				});
			}
			catch(err) {
				res.send({error: err.message});
			}
		}
	},

	{	
		path:   '/api/v1/available',
		method: 'get',
		sessions: false,
		secure: false,
		handler: function(req, res) {
			res.send(vrt.available());
		}
	},

	{	
		path:   '/api/v1/create',
		method: 'post',
		sessions: false,
		secure: false,
		handler: function(req, res) {
			req.accepts('application/json');
			try {
				vrt.create(req.body, function(err, config) {
					config = config || {};
					config.created_from_ip_address = req.connection.remoteAddress;
					config.error =  err ? err.message : 0;
					res.send(config);
				});
			}
			catch(err) {
				res.send({error: err.message});
			}
		}
	},

	{	
		path:   '/api/v1/:id',
		method: 'get',
		sessions: false,
		secure: false,
		handler: function(req, res) {
			vrt.get(req.params.id, function(err, config) {
				config = config || {};
				config.error =  err ? err.message : 0;
				res.send(config);
			});
		}
	},

	{	
		path:   '/api/v1/:id',
		method: 'post',
		sessions: false,
		secure: false,
		handler: function(req, res) {
			req.accepts('application/json');
			try {
				vrt.write(req.params.id, req.body, function(err) {
					res.send({error: err ? err.message : 0});
				});
			}
			catch(err) {
				res.send({error: err.message});
			}
		}
	},

	{	
		path:   '/api/v1/:id/save',
		method: 'post',
		sessions: false,
		secure: false,
		handler: function(req, res) {
			req.accepts('application/json');
			try {
				vrt.save(req.params.id, req.body, function(err) {
					res.send({error: err ? err.message : 0});
				});
			}
			catch(err) {
				res.send({error: err.message});
			}
		}
	}
	
];