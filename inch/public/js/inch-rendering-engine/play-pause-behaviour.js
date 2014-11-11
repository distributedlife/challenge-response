"use strict";

var $ = require('zepto-browserify').$;
var Howler = require('howler').Howler;

module.exports = {
	pause: function() { 
        $('.paused').show();
        $('#paused').show();
        Howler.pauseAll();
    },
    resume: function() { 
        $('.paused').hide();
        $('#paused').hide(); 
        Howler.resumeAll();
    }	
};