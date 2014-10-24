define([], function() {
	"use strict";

	var next = {};

	return {
 		next: function (key) {
 			if (next[key] === undefined) {
 				next[key] = 0;
 			}

 			return ++next[key]; 
 		}
	};
});