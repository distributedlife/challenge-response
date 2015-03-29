"use strict";

var express = require('express');
var favicon = require('serve-favicon');
var each = require('lodash').each;

module.exports = {
  type: "Server",
  deps: ["SocketSupport"],
  func: function (configureServerSockets) {
    var pages = ["primary"];
    var extension = ".jade";
    var server;

    var configureApp = function (assetPath) {
      var app = express();

      app.use('/game', express.static(assetPath));
      app.use('/inch', express.static(__dirname + '/../../public/'));
      app.use(require('morgan')('combined'));
      app.use(require('body-parser').urlencoded({extended: true }));
      app.use(require('body-parser').json());
      app.set('views', __dirname + '/../../public/views');
      app.set('view options', {layout: false});
      app.engine('jade', require('jade').__express);

      var pathToFavIcon = process.cwd() + '/game/favicon.ico';
      if (!require('fs').existsSync(pathToFavIcon)) {
          pathToFavIcon = __dirname + '/../../public/favicon.ico';
      }
      app.use(favicon(pathToFavIcon));

      return app;
    };

    var configureRoutes = function (callbacks, app) {
      each(pages, function (page) {
        app.get('/:mode/' + page, function (req, res) {
          var mode = req.params.mode;

          if (callbacks[mode] === undefined) {
            res.redirect('/');
            return;
          }

          res.render(page + extension, { mode: mode });
        });
      });
    };

    return {
      start: function (assetPath, callbacks) {
        var app = configureApp(assetPath);
        configureRoutes(callbacks, app);

        server = require('http').createServer(app);
        server.listen(process.env.PORT || 3000);

        configureServerSockets().start(server, callbacks);
      },
      stop: function () {
        configureServerSockets().stop();

        if (server !== undefined) {
          server.close();
        }
      }
    };
  }
};