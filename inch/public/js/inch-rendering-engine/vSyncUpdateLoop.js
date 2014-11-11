"use strict";

module.exports = function(window) {
	return function(updateFunc) {
	    return {
	        run: function(time) {
	            updateFunc(time);

	            window.requestAnimationFrame(this.run.bind(this));
	        }
	    };
	};
};