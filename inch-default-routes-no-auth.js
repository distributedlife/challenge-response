"use strict";

module.exports = function(callbacks) {
	return {
		configure: function(app, server) {
			// app.get('/', function(req, res) { res.render('index.haml'); });
			// app.get('/:mode/', function(req, res) { res.render('index.haml'); });
			// app.get('/:mode/observer', function(req, res) { res.render('observer.haml'); });
			app.get('/:mode/primary', function(req, res) {
				var mode = req.params.mode;

				if (callbacks[mode] === undefined) {
					res.redirect('/');
					return;
				}

				callbacks[mode](server);

				res.render('primary.haml');
			});
			// app.get('/:mode/controller', function(req, res) { res.render('controller.haml'); });
			// app.get('/:mode/diagnostics', function(req, res) { res.render('diagnostics.haml'); });
			// app.get('/:mode/mobile', function(req, res) { res.render('mobile.haml'); });
		}
	}
}