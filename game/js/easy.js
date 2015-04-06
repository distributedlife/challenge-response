'use strict';

var entryPoint = require('../../plugins/client/entry-point.js');
entryPoint.loadDefaults();
entryPoint.load(require('./levels/easy'));
entryPoint.load(require('./events/on-mute'));
entryPoint.load(require('./events/on-unmute'));

var plugins = entryPoint.plugins;
plugins.set('Window', require('window'));

var clientSideEngine = require('../../plugins/inch-client-assembler/src/assembler.js')(plugins);
clientSideEngine.assembleAndRun();