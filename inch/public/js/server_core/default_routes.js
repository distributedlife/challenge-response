"use strict";

module.exports = function(callbacks) {
	return {
		configure: function(app, server) {
			app.get('/', function(req, res) { res.render('index.haml'); });
			app.get('/:mode/', function(req, res) { 
				// if(req.params.mode === 'socket.io') { 
				// 	return next(err); 
				// } 

				console.log('splurgg')
				res.render('index.haml'); 
			});

			app.get('/:mode/observer', function(req, res) { res.render('observer.haml'); });
			app.get('/:mode/primary', function(req, res) { 
				var mode = req.params.mode;

				if (callbacks[mode] === undefined) {
					console.log('attempted to visit mode', mode);
					res.redirect('/');
				}
				callbacks[mode](server);

				res.render('primary.haml'); 
			});
			app.get('/:mode/controller', function(req, res) { res.render('controller.haml'); });
			app.get('/:mode/diagnostics', function(req, res) { res.render('diagnostics.haml'); });
			app.get('/:mode/mobile', function(req, res) { res.render('mobile.haml'); });
		}
	}
}