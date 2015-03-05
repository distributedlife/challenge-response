"use strict";

var iconSize = 32;
var position = function (slot) { return slot * iconSize; };
var iconTop = function () { return 0; };
var textTop = function () { return +6; };

var landscape = function ($) {
    var pos = 0;
    $(".fullscreen").css("top", position(pos) - iconTop() + "px").css("right", "0");
    pos += 1;
    $(".sound-on").css("top", position(pos) - iconTop() + "px").css("right", "0");
    $(".sound-off").css("top", position(pos) - iconTop() + "px").css("right", "0");
    pos += 1;
    $(".disconnected").css("top", position(pos) - iconTop() + "px").css("right", "0");
    pos += 1;
    $(".paused").css("top", position(pos) - iconTop() + "px").css("right", "0");
    pos += 1;
    $(".players").css("top", position(pos) - iconTop() + "px").css("right", "0");
    pos += 1;
    $(".player-count").css("top", position(pos) - textTop() + "px").css("right", "0");
    pos += 1;
    $(".observers").css("top", position(pos) - iconTop() + "px").css("right", "0");
    pos += 1;
    $(".observer-count").css("top", position(pos) - textTop() + "px").css("right", "0");
    pos += 1;
};

var portrait = function ($) {
    var pos = 0;
    $(".fullscreen").css("right", position(pos) + "px").css("top", iconTop() + "px");
    pos += 1;
    $(".sound-on").css("right", position(pos) + "px").css("top", iconTop() + "px");
    $(".sound-off").css("right", position(pos) + "px").css("top", iconTop() + "px");
    pos += 1;
    $(".disconnected").css("right", position(pos) + "px").css("top", iconTop() + "px");
    pos += 1;
    $(".paused").css("right", position(pos) + "px").css("top", iconTop() + "px");
    pos += 1;
    $(".players").css("right", position(pos) + "px").css("top", iconTop() + "px");
    pos += 1;
    $(".player-count").css("right", position(pos) + "px").css("top", textTop() + "px");
    pos += 1;
    $(".observers").css("right", position(pos) + "px").css("top", iconTop() + "px");
    pos += 1;
    $(".observer-count").css("right", position(pos) + "px").css("top", textTop() + "px");
    pos += 1;
};

module.exports = {
    type: "IconLayout",
    func: function () {
        var $ = require('zepto-browserify').$;

        return {
            IconLayout: function (orientation) {
                if (orientation === "landscape") {
                    landscape($);
                } else {
                    portrait($);
                }
            }
        };
    }
};