'use strict';

var entryPoint = require('ensemblejs-client');
entryPoint.loadWindow(require('window'));
entryPoint.loadDefaults();
entryPoint.set('GameMode', 'hard');
entryPoint.load(require('./views/hard'));
entryPoint.load(require('./events/on-mute'));
entryPoint.load(require('./events/on-unmute'));
entryPoint.run();