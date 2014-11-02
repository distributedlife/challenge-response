"use strict";

module.exports = function(level) {
	return {
		configure: function(app) {
			app.get('/', function(req, res) { res.render('index.haml'); });

			app.get('/observer', function(req, res) { res.render('observer.haml'); });
			app.get('/primary', function(req, res) { res.render('primary.haml', { level: level } ); });
			app.get('/controller', function(req, res) { res.render('controller.haml'); });
			app.get('/diagnostics', function(req, res) { res.render('diagnostics.haml'); });
			app.get('/mobile', function(req, res) { res.render('mobile.haml'); });
		}
	}
}