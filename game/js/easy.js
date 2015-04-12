'use strict';

var entryPoint = require('ensemblejs-client');
entryPoint.loadWindow(require('window'));
entryPoint.loadDefaults();
entryPoint.load(require('./levels/easy'));
entryPoint.load(require('./events/on-mute'));
entryPoint.load(require('./events/on-unmute'));
entryPoint.run();

//
// {
//   levels: ['easy'],
//   events: ['on-mute', 'on-unmute']
// }