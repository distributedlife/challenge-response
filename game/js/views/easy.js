'use strict';

//jshint maxparams:false
module.exports = {
  type: 'OnClientReady',
  deps: ['Config', 'StateTrackerHelpers', 'StateTracker', 'PacketAcknowledgements', 'RegisterEffect', 'DefinePlugin', '$'],
  func: function easy (config, trackerHelpers, tracker, acknowledgements, registerEffect, define, $) {
    var colour = require('color');
    var Howl = require('howler').Howl;
    var each = require('lodash').each;
    var equals = trackerHelpers().equals;
    var centreInCamera = require('../supporting-libs/centre-in-camera');
    var adapter = require('../three-js-dep/inch-plugin-render-engine-adapter-threejs/adapter');
    var grid = require('../supporting-libs/debug-grid');
    var theCamera = require('../three-js-dep/inch-plugin-camera-orthographic-centred/camera');
    var mainTemplate = require('../../views/overlays/easy.jade');
    var priorScoresTemplate = require('../../views/partials/priorScores.jade');
    var dims;
    var camera;
    var renderer;
    var scene;

    return ['easy', function setup (newDims) {
      dims = newDims;

      var Circle = require('../three-js-dep/inch-geometry2d-circle/circle.js')(adapter);

      $()('#overlay').append(mainTemplate());


      //Render layer concern
      //Setup threejs-camera, inch-scene, threejs-scene, threejs-renderer
      camera = theCamera(adapter, dims);
      scene = require('../three-js-dep/inch-scene/scene.js')(adapter.createScene());
      renderer = adapter.createRenderer(dims);
      adapter.attachRenderer(config().client.element, renderer);

      scene.add(grid(adapter, dims));

      var showInstructions = function (model, priorModel, statusIndicator) {
        $()('#instructions').show();
        $()('#challenge').hide();
        $()('#results').hide();
        $()('#falsestart').hide();
        statusIndicator.changeColour(0, colour('grey').rgbArray());
      };

      var hideInstructions = function (model, priorModel, statusIndicator, waitingSound) {
        $()('#instructions').hide();
        statusIndicator.changeColour(0, colour('red').rgbArray());
        waitingSound.play();
      };

      var showChallenge = function (model, priorModel, statusIndicator, goSound, waitingSound) {
        waitingSound.stop();
        goSound.play();

        $()('#challenge').show();
        acknowledgements().ack('show-challenge');
        statusIndicator.changeColour(0, colour('green').rgbArray());
      };

      var showResults = function (model, priorModel, statusIndicator) {
        $()('#challenge').hide();
        $()('#results').show();
        statusIndicator.changeColour(0, colour('black').rgbArray());
      };

      var showFalseStart = function (model, priorModel, statusIndicator, goSound, waitingSound) {
        $()('#falsestart').show();
        statusIndicator.changeColour(0, colour('orange').rgbArray());
        goSound.stop();
        waitingSound.stop();
      };

      var updateScore = function (model) {
        console.log(model);
        $()('#score')[0].innerText = model;

        var score = $()('#score');
        var centered = centreInCamera(dims, camera, score.width(), score.height());

        score.css('left', centered.left + 'px');
        score.css('top', centered.top + 'px');
        score.show();
      };

      var statusIndicator = new Circle(scene.add, scene.remove, {
        radius: 100,
        segments: 80,
        position: { x: 0, y: 0, z: -100}
      });
      registerEffect().register(statusIndicator);

      var waitingSound = new Howl({
        urls: ['/game/audio/waiting.mp3']
      });
      var goSound = new Howl({
        urls: ['/game/audio/go.mp3']
      });

      var onScoreAddedFunction = function() {
        return function (id, currentValue) {
          $()('#prior-scores').append(priorScoresTemplate({id: 'prior-score-' + id, score: currentValue.score}));
        };
      };
      var updateHightlight = function(id, currentValue) {
        if (currentValue.best) {
          $()('#prior-score-' + id).addClass('best');
        } else {
          $()('#prior-score-' + id).removeClass('best');
        }
      };
      var removePriorScore = function(id) {
        $()('#prior-score-' + id).remove();
      };
      var addExistingScoresFunction = function() {
        return function (currentValues) {
          each(currentValues, function(value) {
            $()('#prior-scores').append(priorScoresTemplate({id: 'prior-score-' + value.id, score: value.score}));
          });
        };
      };

      var theGameState = function (state) { return state.controller.state; };
      var theScore = function (state) { return state.controller.score; };
      var thePriorScores = function (state) { return state.controller.priorScores; };

      tracker().onChangeTo(theGameState, equals('ready'), showInstructions, statusIndicator);
      tracker().onChangeTo(theGameState, equals('waiting'), hideInstructions, [statusIndicator, waitingSound]);
      tracker().onChangeTo(theGameState, equals('challengeStarted'), showChallenge, [statusIndicator, goSound, waitingSound]);
      tracker().onChangeTo(theGameState, equals('complete'), showResults, statusIndicator);
      tracker().onChangeTo(theGameState, equals('falseStart'), showFalseStart, [statusIndicator, goSound, waitingSound]);
      tracker().onChangeOf(theScore, updateScore);
      tracker().onElementAdded(thePriorScores, onScoreAddedFunction(), addExistingScoresFunction());
      tracker().onElementChanged(thePriorScores, updateHightlight);
      tracker().onElementRemoved(thePriorScores, removePriorScore);

      define()('OnPhysicsFrame', function easy () {
        return function () {
          renderer.render(scene.scene(), camera);
        };
      });
      define()('OnResize', function easy () {
        return function (newDims) {
          dims = newDims;

          renderer.setSize(dims.usableWidth, dims.usableHeight);
          adapter.setCameraAspectRatio(camera, dims.ratio);
        };
      });
      define()('OnPause', function easy () {
        return function () {
          waitingSound.pause();
          goSound.pause();
        };
      });
      define()('OnResume', function easy () {
        return function () {
          if (waitingSound.pos() > 0) {
            waitingSound.play();
          }

          if (goSound.pos() > 0) {
            goSound.play();
          }
        };
      });
    }];
  }
};