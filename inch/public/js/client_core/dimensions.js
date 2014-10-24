define(["vendor/window"], function(window) {
	"use strict";
    
    var min_margin = 32;

    return function(ratio) {
        var width = undefined;
        var height = undefined;
        var ratioHeight = Math.round(window.innerWidth / ratio);
        var ratioWidth = Math.round(window.innerHeight * ratio);
        var orientation = "";
        
        if (ratioHeight >= window.innerHeight) {
            if (ratioWidth + min_margin + min_margin > window.innerWidth) {
                width = window.innerWidth - min_margin - min_margin;
                height = ratioHeight;
            } else {            
                width = ratioWidth;
                height = window.innerHeight;
            }

            orientation = "landscape";
        } else {
            if (ratioHeight + min_margin + min_margin > window.innerHeight) {
                width = ratioWidth;
                height = window.innerHeight - min_margin - min_margin;
            } else {            
                height = ratioHeight;
                width = window.innerWidth;
            }

            orientation = "portrait";
        }

        var margin = Math.round(window.innerHeight - height)/2;

        return {width: width, height: height, margin: margin, orientation: orientation};
    };
});