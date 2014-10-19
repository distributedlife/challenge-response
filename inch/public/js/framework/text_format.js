define([], function() {
	"use strict";

	return {
		number_to_3_chars: function(count) {
            if (count < 1000) {
                return count;
            } else if (count < 10000) {
                return (Math.round(count / 1000))+"K+";
            } else {
                return "9K+";
            }
        },
	};
});