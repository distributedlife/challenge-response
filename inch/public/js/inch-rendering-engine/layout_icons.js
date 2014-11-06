"use strict";

var $ = require('zepto-browserify').$;

var icon_size = 32;
var position = function(slot) { return slot * icon_size; };
var icon_top = function() { return 0; };
var text_top = function() { return +6; };

var landscape = function() {
    var pos = 0;
    $(".fullscreen").css("top", position(pos++)-icon_top()+"px").css("right", "0"); 
    $(".sound-on").css("top", position(pos)-icon_top()+"px").css("right", "0"); 
    $(".sound-off").css("top", position(pos++)-icon_top()+"px").css("right", "0"); 
    $(".disconnected").css("top", position(pos++)-icon_top()+"px").css("right", "0");
    $(".paused").css("top", position(pos++)-icon_top()+"px").css("right", "0");
    $(".players").css("top", position(pos++)-icon_top()+"px").css("right", "0");
    $(".player-count").css("top", position(pos++)-text_top()+"px").css("right", "0");
    $(".observers").css("top", position(pos++)-icon_top()+"px").css("right", "0");
    $(".observer-count").css("top", position(pos++)-text_top()+"px").css("right", "0");
};

var portrait = function() {
    var pos = 0;
    $(".fullscreen").css("right", position(pos++)+"px").css("top", icon_top()+"px");
    $(".sound-on").css("right", position(pos)+"px").css("top", icon_top()+"px");
    $(".sound-off").css("right", position(pos++)+"px").css("top", icon_top()+"px");
    $(".disconnected").css("right", position(pos++)+"px").css("top", icon_top()+"px");
    $(".paused").css("right", position(pos++)+"px").css("top", icon_top()+"px");
    $(".players").css("right", position(pos++)+"px").css("top", icon_top()+"px");
    $(".player-count").css("right", position(pos++)+"px").css("top", text_top()+"px");
    $(".observers").css("right", position(pos++)+"px").css("top", icon_top()+"px");
    $(".observer-count").css("right", position(pos++)+"px").css("top", text_top()+"px");
};

module.exports = function(orientation) {
    if (orientation === "landscape") {
        landscape();
    } else {
        portrait();
    }
};