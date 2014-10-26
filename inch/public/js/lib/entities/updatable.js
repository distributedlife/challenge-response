"use strict";

var rek = require('rekuire');
var basic = rek('basic');
var _ = rek('lodash');

module.exports = function(name, on_update) {
	var entity = Object.create(basic(name));
	on_update = on_update || function() {};

	_.extend(entity, {
		active: true,
		update: on_update
	});
	
	return entity;
};