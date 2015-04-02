'use strict';

var next = {};

module.exports = {
	next: function (key) {
		if (next[key] === undefined) {
			next[key] = 0;
		}

    next[key] += 1;
		return next[key];
	},
	exists: function(key) {
		return next[key] !== undefined;
	}
};