define(["vendor/rStats"], function(ignored) {
	"use strict";

	var rS = new rStats({
		CSSPath: "/inch/css/",
		values: {
			frame: { caption: 'Total frame time (ms)', over: 16 },
        	raf: { caption: 'Time since last rAF (ms)' },
        	fps: { caption: 'Framerate (FPS)', below: 30 },
		},
		groups: [
	        { caption: 'Framerate', values: [ 'fps', 'raf' ] },
	        { caption: 'Frame Budget', values: [ 'frame', 'tick' ] },
	        { caption: 'Respond To Server', values: [ 'update-lib', 'update-custom' ] }
	    ]
	});

	return rS;
});