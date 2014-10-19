require(["client_core/assembler", "game/views/display"], function (RenderingEngineAssembler, Display) {
  "use strict";

  return function() {
    var engine_config = {
    	display_config: {
    		observer: true
    	},
		display: Display
    };

    Object.create(RenderingEngineAssembler(engine_config)).run();
  }();
});
