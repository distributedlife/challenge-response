require(["client_core/assembler", "framework/ui/dedicated_controller"], function (RenderingEngineAssembler, DedicatedController) {
  "use strict";

  return function() {
    var engine_config = {
      display_config: {
        controls: ['left:joystick-2-left-right', 'right:buttons-1']
      },
      display: DedicatedController,
      webgl: false
    };

    Object.create(RenderingEngineAssembler(engine_config)).run();
  }();
});
