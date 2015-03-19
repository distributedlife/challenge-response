"use strict";

module.exports = {
    Server: function (assetPath, callbacks) {
        var server;
        var io;
        var express = require('express');
        var favicon = require('serve-favicon');
        var configureRoutes = require("./configure-routes");

        return {
            start: function (plugins) {
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

                server = require('http').createServer(app);
                var pages = ["primary"];
                configureRoutes(callbacks, app, pages, '.jade');

                server.listen(process.env.PORT || 3000);

                io = require('socket.io').listen(server);

                //TODO: Plugins should be loaded in some default place rather than just shoved in here
                plugins.load(require('../../../inch-input-handler/src/input-handler.js'));
                plugins.load(require('../../../inch-delayed-effects/src/manager.js'));
                plugins.load(require('../../../inch-socket-support/src/socket-support.js'));
                plugins.load(require('../../../inch-game-engine/src/engine.js'));
                plugins.load(require('../../../inch-plugin-state-mutator-default/src/index.js'));
                plugins.load(require('../../../inch-plugin-behaviour-invoker-default/src/index.js'));
                plugins.load({
                    type: "StateSeed",
                    func: function () {
                        return {
                            inch: {
                                players: 0,
                                observers: 0,
                                paused: false,
                                started: Date.now(),
                                dimensions: { width: 1000, height: 500 }
                            }
                        };
                    }
                });

                plugins.load({
                    type: "OnPause",
                    deps: ["StateAccess"],
                    func: function (State) {
                        return function () {
                            return {
                                inch: {
                                    paused: true
                                }
                            };
                        };
                    }
                });
                plugins.load({
                    type: "OnUnpause",
                    deps: ["StateAccess"],
                    func: function (State) {
                        return function () {
                            return {
                                inch: {
                                    paused: false
                                }
                            };
                        };
                    }
                });
                plugins.load({
                    type: "OnPlayerConnected",
                    deps: ["StateAccess"],
                    func: function (State) {
                        return function () {
                            return {
                                inch: {
                                    players: State().get("players") + 1
                                }
                            };
                        };
                    }
                });
                plugins.load({
                    type: "OnPlayerDisconnected",
                    deps: ["StateAccess"],
                    func: function (State) {
                        return function () {
                            return {
                                inch: {
                                    paused: true,
                                    players: State().get("players") - 1
                                }
                            };
                        };
                    }
                });
                plugins.load({
                    type: "OnObserverConnected",
                    deps: ["StateAccess"],
                    func: function (State) {
                        return function () {
                            return {
                                inch: {
                                    observers: State().get("observers") + 1
                                }
                            };
                        };
                    }
                });
                plugins.load({
                    type: "OnObserverDisconnected",
                    deps: ["StateAccess"],
                    func: function (State) {
                        return function () {
                            return {
                                inch: {
                                    observers: State().get("observers") - 1
                                }
                            };
                        };
                    }
                });

                var each = require('lodash').each;
                plugins.load({
                    type: "InitialiseState",
                    deps: ["StateSeed", "StateMutator", "RawStateAccess"],
                    func: function (StateSeed, StateMutator, RawStateAccess) {
                        return function () {
                            each(StateSeed(), function (state) {
                                StateMutator()(state);
                            });
                        };
                    }
                });

                plugins.get("SocketSupport")(io, callbacks);
                plugins.get("InitialiseState")();
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