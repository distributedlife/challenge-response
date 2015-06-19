'use strict';

var entryPoint = require('ensemblejs-client');
entryPoint.loadWindow(require('window'));
entryPoint.loadDefaults();
//TODO: move this into the client framework
entryPoint.set('ServerUrl', process.env.ENSEMBLEJS_URL);
entryPoint.set('GameMode', 'easy');
entryPoint.load(require('./views/easy'));
entryPoint.load(require('./events/on-mute'));
entryPoint.load(require('./events/on-unmute'));
entryPoint.run();