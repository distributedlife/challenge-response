'use strict';

var $ = require('zepto-browserify').$;
var pendingAcknowledgements = require('../../inch-socket-pending-acknowledgements/src/index.js')();

//jshint maxparams: false
module.exports = {
  type: 'ClientSideAssembler',
  deps: ['DisplayBehaviour', 'SocketBehaviour', 'Dimensions', 'IconLayout', 'Element', 'InputElement', 'Window', 'UpdateLoop'],
  func: function (displayBehaviour, socketBehaviour, dimensions, iconLayout, element, inputElement, window, updateLoop) {
    return {
      assembleAndRun: function () {
        var display = displayBehaviour().Display(pendingAcknowledgements.ackLast, pendingAcknowledgements.add);
        var socket = socketBehaviour().SocketBehaviour(pendingAcknowledgements.flush);
        socket.connect(display.setup, display.update);

        var resizeCanvas = function () {
          var dims = dimensions().get();
          iconLayout().IconLayout(dims.orientation);

          $('#' + element()).css('margin-top', dims.marginTopBottom);
          $('#' + element()).css('width', dims.usableWidth);
          $('#' + element()).css('height', dims.usableHeight);

          $('#' + inputElement()).css('margin-top', dims.marginTopBottom);
          $('#' + inputElement()).css('width', dims.usableWidth);
          $('#' + inputElement()).css('height', dims.usableHeight);

          display.resize(dims);
        };

        $(window()).on('load resize', resizeCanvas);
        updateLoop().UpdateLoop(display.updateDisplay).run();
      }
    };
  }
};