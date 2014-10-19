require(["client_core/assembler", "framework/ui/diagnostic_controller"], function (RenderingEngineAssembler, DiagnosticController) {
  "use strict";

  return function() {
    var engine_config = {
      display_config: {
        controls: ['left:joystick-N', 'right:buttons-6']
      },
      display: DiagnosticController,
      webgl: false
    };

    Object.create(RenderingEngineAssembler(engine_config)).run();
  }();
});
