"use strict";

module.exports = {
    Server: function (assetPath, callbacks) {
        var server;
        var io;
        var express = require('express');
        var favicon = require('serve-favicon');
        var configureRoutes = require("./configure-routes");

        return {
            start: function () {
                var app = express();
                app.use('/game', express.static(assetPath));
                app.use('/inch', express.static(__dirname + '/../../public/'));
                app.use(require('morgan')('combined'));
                app.use(require('body-parser').urlencoded({extended: true }));
                app.use(require('body-parser').json());
                app.set('views', __dirname + '/../../public/views');
                app.set('view options', {layout: false});
                app.engine('jade', require('jade').__express);

                app.use(function (req, res, next) {
                    res.setHeader('Access-Control-Allow-Origin', "http://"+req.headers.host+':8000');
                    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                        next();
                    }
                );

                var pathToFavIcon = process.cwd() + '/game/favicon.ico';
                if (!require('fs').existsSync(pathToFavIcon)) {
                    pathToFavIcon = __dirname + '/../../public/favicon.ico';
                }
                app.use(favicon(pathToFavIcon));

                server = require('http').createServer(app);
                io = require('socket.io').listen(server);

                var pages = ["primary"];
                configureRoutes(callbacks, app, io, pages, '.jade');

                server.listen(process.env.PORT || 3000);
            },
            stop: function () {
                if (io !== undefined) {
                    io.close();
                }
                if (server !== undefined) {
                    server.close();
                }
            }
        };
    }
};