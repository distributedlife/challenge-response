define([], function() {
  "use strict";

  var half = function(v) { return v / 2.0; };
  
  return function(parent, x, y, width, height) {
    return {
      parent: function() { return parent; },
      left: function() { return x - half(width); },
      right: function() { return x + half(width); },
      top: function() { return y - half(height); },
      bottom: function() {return y + half(height); },
      
      dimensions: function() {
        return {
          x: x,
          y: y,
          width: width,
          height: height
        }
      },

      is_colliding_with: function(other_box) {
        if (this.parent() === other_box.parent()) { return false; }
        if (this.bottom() < other_box.top()) { return false; }
        if (this.top() > other_box.bottom()) { return false; }
        if (this.right() < other_box.left()) { return false; }
        if (this.left() > other_box.right()) { return false; }

        return true;
      }
    };
  };
});