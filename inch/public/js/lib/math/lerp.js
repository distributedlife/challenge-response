"use strict";

module.exports = {
	lerp: function(from, to, t) {
		if (t >= 1.0) {
			return to;
		}

      	return (1.0 - t) * from + to * t;
    },

    lerpVector: function(from, to, t) {
    	return {
    		x: this.lerp(from.x, to.x, t),
    		y: this.lerp(from.y, to.y, t),
    		z: this.lerp(from.z, to.z, t) 
    	};	
    },

    lerpRGBA: function(from, to, t) {
      return [
        this.lerp(from[0], to[0], t),
        this.lerp(from[1], to[1], t),
        this.lerp(from[2], to[2], t),
        this.lerp(from[3], to[3], t)
      ];
    }
};