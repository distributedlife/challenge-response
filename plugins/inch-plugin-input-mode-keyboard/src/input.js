'use strict';

module.exports = {
  deps: ['Window', 'InputElement'],
  type: 'InputMode',
  func: function (window, element) {
    var _ = require('lodash');
    var $ = require('zepto-browserify').$;

    return {
      InputMode: function () {
        var x = 0;
        var y = 0;
        var touches = [];
        var keys = {};
        var singlePressKeys = {};

        var keyMap = function () {
          var map = {
            '9': 'tab',
            '17': 'control',
            '18': 'alt',
            '27': 'escape',
            '32': 'space',
            '37': 'left',
            '38': 'up',
            '39': 'right',
            '40': 'down'
          };
          var i = 0;

          for (i = 48; i <= 122; i += 1) {
            if (i > 57 && i < 65) { continue; }
            if (i > 90 && i < 97) { continue; }
            if (map[i] !== undefined) {
              continue;
            }
            map[i] = String.fromCharCode(i);
          }

          return map;
        };

        var mouseMap = function () {
          return {
            '1': 'button1',
            '3': 'button2'
          };
        };

        var singlePress = function (key) {
          singlePressKeys[key] = true;
        };

        var press = function (key) {
          keys[key] = true;
        };

        var release = function (key) {
          keys[key] = false;
        };

        var bindToWindowEvents = function () {
          $(window()).on('mousedown', function (e) {
            press(mouseMap()[e.which]);
            e.preventDefault();
          });

          $(window()).on('mouseup', function (e) {
            release(mouseMap()[e.which]);
            e.preventDefault();
          });

          var elementId = '#' + element();

          $(elementId).on('mousemove', function (e) {
            x = e.layerX;
            y = e.layerY;
          });

          $(elementId).on('touchstart', function (e) {
            _.each(e.touches, function (touch) {
              var x = touch.clientX - touch.target.offsetLeft;
              var y = touch.clientY - touch.target.offsetTop;
              touches.push({ id: touch.identifier, x: x, y: y, force: touch.webkitForce || 1 });
            });
          });

          $(elementId).on('touchmove', function (e) {
            _.each(e.touches, function (touch) {
              var x = touch.clientX - touch.target.offsetLeft;
              var y = touch.clientY - touch.target.offsetTop;
              touches.push({ id: touch.identifier, x: x, y: y, force: touch.webkitForce || 1 });
            });
          });

          $(elementId).on('touchend', function (e) {
            var ids = _.map(e.changedTouches, function (touch) { return touch.identifier; });
            touches = _.reject(touches, function (touch) { return ids.indexOf(touch.id) !== -1; });
          });

          $(elementId).on('touchleave', function (e) {
            var ids = _.map(e.changedTouches, function (touch) { return touch.identifier; });
            touches = _.reject(touches, function (touch) { return ids.indexOf(touch.id) !== -1; });
          });

          $(elementId).on('touchcancel', function (e) {
            var ids = _.map(e.changedTouches, function (touch) { return touch.identifier; });
            touches = _.reject(touches, function (touch) { return ids.indexOf(touch.id) !== -1; });
          });


          $(window().document).keypress(function (e) {
            if (e.metaKey) { return; }

            singlePress(keyMap()[e.which]);
            //to ensure that both keypress and keydown fire on the same event. We can work around this
            //but we'll need to get a replicable scene (this is only a problem for the space key)
            // e.preventDefault();
          });

          $(window().document).keydown(function (e) {
            if (e.metaKey) { return; }

            press(keyMap()[e.which]);
            // e.preventDefault();
          });

          $(window().document).keyup(function (e) {
            release(keyMap()[e.which]);
          });
        };

        bindToWindowEvents();

        return {
          getCurrentState: function () {
            var inputData = {
              x: x,
              y: y,
              touches: touches
            };

            var keysToSend = [];
            _.each(keys, function (value, key) {
              if (value) {
                keysToSend.push(key);
              }
            });
            inputData.keys = keysToSend;

            var singlePressKeysToSend = [];
            _.each(singlePressKeys, function (value, key) {
              if (value) {
                singlePressKeysToSend.push(key);
              }
              singlePressKeys[key] = false;
            });
            inputData.singlePressKeys = singlePressKeysToSend;

            return inputData;
          }
        };
      }
    };
  }
};