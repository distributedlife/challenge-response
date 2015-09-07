'use strict';

var colour = require('color');
var each = require('lodash').each;

var centreInCamera = require('../supporting-libs/centre-in-camera');
var adapter = require('../three-js-dep/inch-plugin-render-engine-adapter-threejs/adapter');
var grid = require('../supporting-libs/debug-grid');
var theCamera = require('../three-js-dep/inch-plugin-camera-orthographic-centred/camera');
var mainTemplate = require('../../views/overlays/easy.jade');
var priorScoresTemplate = require('../../views/partials/priorScores.jade');

function theGameState (state) { return state.controller.state; };
function theScore (state) { return state.controller.score; };
function thePriorScores (state) { return state.controller.priorScores; };

//jshint maxparams:false
module.exports = {
  type: 'OnReady',
  deps: ['Config', 'StateTrackerHelpers', 'StateTracker', 'PacketAcknowledgements', 'RegisterEffect', 'DefinePlugin', '$'],
  func: function HardMode (config, trackerHelpers, tracker, acknowledgements, registerEffect, define, $) {

    var dims;
    var camera;
    var renderer;
    var scene;

    return ['hard', function setup (newDims) {
      var equals = trackerHelpers().equals;

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

      function showInstructions (model, priorModel, statusIndicator) {
        $()('#instructions').show();
        $()('#challenge').hide();
        $()('#results').hide();
        $()('#falsestart').hide();
        statusIndicator.changeColour(0, colour('grey').rgbArray());
      }

      function hideInstructions (model, priorModel, statusIndicator) {
        $()('#instructions').hide();
        statusIndicator.changeColour(0, colour('red').rgbArray());
      }

      function showChallenge (model, priorModel, statusIndicator) {
        $()('#challenge').show();
        acknowledgements().ack('show-challenge');
        statusIndicator.changeColour(0, colour('green').rgbArray());
      }

      function showResults (model, priorModel, statusIndicator) {
        $()('#challenge').hide();
        $()('#results').show();
        statusIndicator.changeColour(0, colour('black').rgbArray());
      }

      function showFalseStart (model, priorModel, statusIndicator) {
        $()('#falsestart').show();
        statusIndicator.changeColour(0, colour('orange').rgbArray());
      }

      function updateScore (model) {
        $()('#score')[0].innerText = model;

        var score = $()('#score');
        var centered = centreInCamera(dims, camera, score.width(), score.height());

        score.css('left', centered.left + 'px');
        score.css('top', centered.top + 'px');
        score.show();
      }

      var statusIndicator = new Circle(scene.add, scene.remove, {
        radius: 10,
        segments: 80,
        position: { x: 0, y: 0, z: -100}
      });
      registerEffect().register(statusIndicator);

      function onScoreAddedFunction() {
        return function (currentValue) {
          $()('#prior-scores').append(priorScoresTemplate({id: 'prior-score-' + currentValue.id, score: currentValue.score}));
        };
      }

      function updateHightlight (currentValue) {
        if (currentValue.best) {
          $()('#prior-score-' + currentValue.id).addClass('best');
        } else {
          $()('#prior-score-' + currentValue.id).removeClass('best');
        }
      }

      function addExistingScoresFunction () {
        return function (currentValues) {
          each(currentValues, function(value) {
            $()('#prior-scores').append(priorScoresTemplate({id: 'prior-score-' + value.id, score: value.score}));
          });
        };
      };

      tracker().onChangeTo(theGameState, equals('ready'), showInstructions, statusIndicator);
      tracker().onChangeTo(theGameState, equals('waiting'), hideInstructions, [statusIndicator]);
      tracker().onChangeTo(theGameState, equals('challengeStarted'), showChallenge, [statusIndicator]);
      tracker().onChangeTo(theGameState, equals('complete'), showResults, statusIndicator);
      tracker().onChangeTo(theGameState, equals('falseStart'), showFalseStart, [statusIndicator]);
      tracker().onChangeOf(theScore, updateScore);
      tracker().onElementAdded(thePriorScores, onScoreAddedFunction(), addExistingScoresFunction());
      tracker().onElementChanged(thePriorScores, updateHightlight);

      define()('OnPhysicsFrame', function HardMode () {
        return function renderScene () {
          renderer.render(scene.scene(), camera);
        };
      });

      define()('OnResize', function HardMode () {
        return function resizeRenderer (newDims) {
          dims = newDims;

          renderer.setSize(dims.usableWidth, dims.usableHeight);
          adapter.setCameraAspectRatio(camera, dims.ratio);
        };
      });
    }];
  }
};