"use strict";

var rek = require('rekuire');
var requirejs = rek('requirejs')
requirejs.config({ baseUrl: 'inch/public/js' })

var unique = requirejs('lib/util/unique');

module.exports = function(name) {
	return {
		id: unique.id(),
		name: name
	};
};