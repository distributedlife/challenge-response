require.config({
    paths: {
      "socket.io-client": "../../socket.io/socket.io",
      game: "../../game/js",
      zepto: "vendor/zepto.min",
      lodash: "vendor/lodash.min",
      text: 'vendor/require-text',
      shader: 'vendor/require-shader'
    },
    shim: {
      "vendor/three": {
        init: function() {
          "use strict";
          return this.THREE;
        }
      },
      "vendor/three/EffectComposer": {
        deps: ["vendor/three", "vendor/three/shaders/CopyShader", "vendor/three/passes/ShaderPass", "vendor/three/passes/MaskPass"],
        init: function(THREE) {
          "use strict";
          return this.THREE.EffectComposer;
        }
      },
      "vendor/three/passes/BloomPass": {
        deps: ["vendor/three", "vendor/three/shaders/CopyShader", "vendor/three/shaders/ConvolutionShader"],
        init: function(THREE) {
          "use strict";
          return this.THREE.BloomPass;
        }
      },
      "vendor/three/passes/MaskPass": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.MaskPass;
        }
      },
      "vendor/three/passes/RenderPass": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.RenderPass;
        }
      },
      "vendor/three/passes/ShaderPass": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.ShaderPass;
        }
      },
      "vendor/three/shaders/BleachBypassShader": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.ConvolutionShader;
        }
      },
      "vendor/three/shaders/ConvolutionShader": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.ConvolutionShader;
        }
      },
      "vendor/three/shaders/CopyShader": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.CopyShader;
        }
      },
      "vendor/three/shaders/DotScreenShader": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.DotScreenShader;
        }
      },
      "vendor/three/shaders/HorizontalBlurShader": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.HorizontalBlurShader;
        }
      },
      "vendor/three/shaders/VerticalBlurShader": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.HorizontalBlurShader;
        }
      },
      "vendor/three/controls/OrbitControls": {
        deps: ["vendor/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.OrbitControls;
        }
      },
			zepto: {
				init: function() {
					"use strict";
					return this.$;
				}
			},
      lodash: {
        exports: "_"
      },
      'vendor/gamepad': {
        init: function() {
          "use strict";
          return this.Gamepad;
        }
      },
      'vendor/websocket': {
        init: function() {
          "use strict";
          return this.WebSocket;
        }
      },
      'vendor/window': {
        init: function() {
          "use strict";
          return this.window;
        }
      },
      'vendor/soundmanager2-nodebug-jsmin': {
        deps: ['vendor/window'],
        init: function() {
          "use strict";
          return this.SoundManager;
        }
      },
      'vendor/screenfull': {
        init: function() {
          "use strict";
          return this.screenfull;
        }
      },
      'lib/particle_engine': {
        deps: ['vendor/ShaderParticleUtils', 'vendor/ShaderParticleGroup', 'vendor/ShaderParticleEmitter'],
        init: function() {
          "use strict";
          return SPE;
        }
      }
    }
});
