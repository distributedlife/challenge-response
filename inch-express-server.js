"use strict";

var express = require('express');
var favicon = require('serve-favicon');

module.exports = {
    Server: function (assetPath, routes) {
        return {
            start: function() {
                var app = express();
                app.use('/game', express.static(assetPath));
                app.use('/inch', express.static(process.cwd() + '/inch/public/'));
                app.set('views', process.cwd() + '/inch/public/views');
                app.use(require('morgan')('combined'));
                app.use(require('body-parser').urlencoded({extended: true }));
                app.use(require('body-parser').json());
                app.set('view options', {layout: false});
                app.use(favicon(__dirname + '/game/favicon.ico'));
                app.engine('haml', require('consolidate').haml);

                var server = require('http').createServer(app);

                routes.configure(app, server);

                server.listen(process.env.PORT || 3000);
            }
        };
    }
};