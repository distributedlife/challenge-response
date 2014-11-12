"use strict";

var $ = require('zepto-browserify').$;

module.exports = {
	disconnected: function() { 
        $('.disconnected').show(); 
    },
    connected: function() { 
        $('.disconnected').hide(); 
    }	
};