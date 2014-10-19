require(["client_core/assembler", level], function (RenderingEngineAssembler, BoundLevelModule) {
  "use strict";

  return function() {
    var engine_config = {
  		display_config: {
  			controls: ['keyboard', 'gamepad']
  		},
  		display: BoundLevelModule,
      webgl: true
    };

    Object.create(RenderingEngineAssembler(engine_config)).run();
  }();
});
