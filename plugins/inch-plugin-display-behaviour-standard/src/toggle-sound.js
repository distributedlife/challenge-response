"use strict";

var $ = require("zepto-browserify").$;
var Howler = require("howler").Howler;

module.exports = function () {
    $(".sound-off").hide();
    $(".sound-on").on('click', function () {
        $(".sound-on").hide();
        $(".sound-off").show();

        Howler.mute();
    });
    $(".sound-off").on('click', function () {
        $(".sound-off").hide();
        $(".sound-on").show();

        Howler.unmute();
    });
};