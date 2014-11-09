"use strict";

var newPracticeGame = function (server) {
    
};

var hideAllTheExpressStuff = function (assetPath, routes) {
    var express = require('express');
    var favicon = require('serve-favicon');

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

    return server;
};
// var server = require('inch-express-server')(pathToAssets, require('./inch/public/js/server_core/default_routes')());
// {
//  'practice': require('./game/js/modes/practice')
//}
var pathToAssets = process.cwd() + "/game";
var server = hideAllTheExpressStuff(
    pathToAssets,
    require('./inch/public/js/server_core/default_routes')({
        'practice': newPracticeGame
    })
);

var entities = require('inch-entity-loader').loadFromPath(process.cwd() + "/game/js/entities/");
var state = require('inch-game-state').andExtendWith({
    controller: new entities.controller()
});
var actionMap = {
    'space': [{target: state.controller.response, keypress: true}],
    'r': [{target: state.controller.reset.bind(state.controller), keypress: true}]
};
var ackMap = {
    'show-challenge': [state.controller.challenge_seen]
};


var game_logic = require('./game/js/logic')(state);


var inputHandler = require('inch-input-handler')(actionMap);
var engine = require('inch-game-engine')(state.isPaused.bind(state), [
    state.update.bind(state),
    inputHandler.update,
    game_logic.update
]);
engine.run(120);

var callbacks = require('inch-standard-socket-support-callbacks')(state, inputHandler);
require('inch-socket-support')(server, callbacks, ackMap);
    
server.listen(process.env.PORT || 3000);