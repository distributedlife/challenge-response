'use strict';

var each = require('lodash').each;
var $ = require('zepto-browserify').$;
var pendingAcknowledgements = require('../../inch-socket-pending-acknowledgements/src/index.js')();

module.exports = function (plugins) {
  each(plugins.get('Font'), function (font) {
    font.load();
  });

  return {
    assembleAndRun: function () {
      var display = plugins.get('DisplayBehaviour').Display(pendingAcknowledgements.ackLast, pendingAcknowledgements.add);
      var socket = plugins.get('SocketBehaviour').SocketBehaviour(pendingAcknowledgements.flush);
      socket.connect(display.setup, display.update);

      var resizeCanvas = function () {
        var dims = plugins.get('Dimensions').get();
        plugins.get('IconLayout').IconLayout(dims.orientation);

        var element = plugins.get('Element');
        $('#' + element).css('margin-top', dims.marginTopBottom);
        $('#' + element).css('width', dims.usableWidth);
        $('#' + element).css('height', dims.usableHeight);

        var inputElement = plugins.get('InputElement');
        $('#' + inputElement).css('margin-top', dims.marginTopBottom);
        $('#' + inputElement).css('width', dims.usableWidth);
        $('#' + inputElement).css('height', dims.usableHeight);

        display.resize(dims);
      };

      $(plugins.get('Window')).on('load resize', resizeCanvas);
      plugins.get('UpdateLoop').UpdateLoop(display.updateDisplay).run();
    }
  };
};