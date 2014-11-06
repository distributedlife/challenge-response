// var rStats = require('../vendor/rStats');
var config = require('../framework/config');

"use strict";

// if (config.nostats) {
	module.exports = function() {
		return {
			start: function() {},
			end: function() {},
			tick: function() {},
			frame: function() {},
			update: function() {}
		}
	};
// }

// var rS = new rStats({
// 	CSSPath: "/inch/css/",
// 	values: {
// 		frame: { caption: 'Total frame time (ms)', over: 16 },
//     	raf: { caption: 'Time since last rAF (ms)' },
//     	fps: { caption: 'Framerate (FPS)', below: 30 },
// 	},
// 	groups: [
//         { caption: 'Framerate', values: [ 'fps', 'raf' ] },
//         { caption: 'Frame Budget', values: [ 'frame', 'tick' ] },
//         { caption: 'Respond To Server', values: [ 'update-inch', 'update-game' ] }
//     ]
// });

// module.exports = rS;