define(["vendor/three", "lodash"], function(THREE, _) {
	"use strict";

	return function(options) {
		options = options || {}

		var defaults = {
	      transparent: false,
	      alphaTest: 0.1,
	      blending: THREE.AdditiveBlending,
	      size: 20,
	      duration: 0,
	      alignment: {
	        horizontal: "centre",
	        vertical: "centre"
	      },
	      scale: {
	        from: 1.0,
	        to: 1.0
	      },
	      colour: {
	        from: [1.0, 1.0, 1.0, 1.0],
	        to: [1.0, 1.0, 1.0, 1.0]
	      },
	      position: {x: 0, y: 0, z: 0},
	      start_hidden: false
	    }

	    _.defaults(options, _.clone(defaults));

	    if (options.start_hidden) {
      		options.transparent = true;
      		options.colour.from[3] = 0.0;
    	}

    	options.colour.current = options.colour.from;
    	options.scale.current = options.scale.from;

    	return options;
    }
});