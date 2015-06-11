'use strict';

//jshint maxparams:7
module.exports = {
  deps: ['Element', 'StateTrackerHelpers', 'StateTracker', 'PendingAcknowledgements', 'RegisterEffect', 'DefinePlugin'],
  type: 'View',
  func: function (element, trackerHelpers, tracker, pendingAcknowledgements, registerEffect, define) {
    var colour = require('color');
    var $ = require('zepto-browserify').$;
    var each = require('lodash').each;
    var equals = trackerHelpers().equals;
    var centreInCamera = require('../../../supporting-libs/src/centre-in-camera');
    var adapter = require('../../../three-js-dep/inch-plugin-render-engine-adapter-threejs/src/adapter');
    var grid = require('../../../supporting-libs/src/debug-grid');
    var theCamera = require('../../../three-js-dep/inch-plugin-camera-orthographic-centred/src/camera');
    var mainTemplate = require('../../views/overlays/easy.jade');
    var priorScoresTemplate = require('../../views/partials/priorScores.jade');
    var dims;
    var camera;
    var renderer;
    var scene;

    return function (newDims) {
      dims = newDims;

      var Circle = require('../../../three-js-dep/inch-geometry2d-circle/src/circle.js')(adapter);

      $('#overlay').append(mainTemplate());


      //Render layer concern
      //Setup threejs-camera, inch-scene, threejs-scene, threejs-renderer
      camera = theCamera(adapter, dims);
      scene = require('../../../three-js-dep/inch-scene/src/scene.js')(adapter.createScene());
      renderer = adapter.createRenderer(dims);
      adapter.attachRenderer(element(), renderer);

      scene.add(grid(adapter, dims));

      var showInstructions = function (model, priorModel, statusIndicator) {
        $('#instructions').show();
        $('#challenge').hide();
        $('#results').hide();
        $('#falsestart').hide();
        statusIndicator.changeColour(0, colour('grey').rgbArray());
      };

      var hideInstructions = function (model, priorModel, statusIndicator) {
        $('#instructions').hide();
        statusIndicator.changeColour(0, colour('red').rgbArray());
      };

      var showChallenge = function (model, priorModel, statusIndicator) {
        $('#challenge').show();
        pendingAcknowledgements().ackLast('show-challenge');
        statusIndicator.changeColour(0, colour('green').rgbArray());
      };

      var showResults = function (model, priorModel, statusIndicator) {
        $('#challenge').hide();
        $('#results').show();
        statusIndicator.changeColour(0, colour('black').rgbArray());
      };

      var showFalseStart = function (model, priorModel, statusIndicator) {
        $('#falsestart').show();
        statusIndicator.changeColour(0, colour('orange').rgbArray());
      };

      var updateScore = function (model) {
        $('#score')[0].innerText = model;

        var score = $('#score');
        var centered = centreInCamera(dims, camera, score.width(), score.height());

        score.css('left', centered.left + 'px');
        score.css('top', centered.top + 'px');
        score.show();
      };

      var statusIndicator = new Circle(scene.add, scene.remove, {
        radius: 10,
        segments: 80,
        position: { x: 0, y: 0, z: -100}
      });
      registerEffect().register(statusIndicator);

      var onScoreAddedFunction = function() {
        return function (currentValue) {
          $('#prior-scores').append(priorScoresTemplate({id: 'prior-score-' + currentValue.id, score: currentValue.score}));
        };
      };
      var updateHightlight = function(currentValue) {
        if (currentValue.best) {
          $('#prior-score-' + currentValue.id).addClass('best');
        } else {
          $('#prior-score-' + currentValue.id).removeClass('best');
        }
      };
      var addExistingScoresFunction = function() {
        return function (currentValues) {
          each(currentValues, function(value) {
            $('#prior-scores').append(priorScoresTemplate({id: 'prior-score-' + value.id, score: value.score}));
          });
        };
      };

      var theGameState = function (state) { return state.controller.state; };
      var theScore = function (state) { return state.controller.score; };
      var thePriorScores = function (state) { return state.controller.priorScores; };

      tracker().onChangeTo(theGameState, equals('ready'), showInstructions, statusIndicator);
      tracker().onChangeTo(theGameState, equals('waiting'), hideInstructions, [statusIndicator]);
      tracker().onChangeTo(theGameState, equals('challengeStarted'), showChallenge, [statusIndicator]);
      tracker().onChangeTo(theGameState, equals('complete'), showResults, statusIndicator);
      tracker().onChangeTo(theGameState, equals('falseStart'), showFalseStart, [statusIndicator]);
      tracker().onChangeOf(theScore, updateScore);
      tracker().onElementAdded(thePriorScores, onScoreAddedFunction(), addExistingScoresFunction());
      tracker().onElementChanged(thePriorScores, updateHightlight);

      define()('OnEachFrame', function () {
        return function () {
          renderer.render(scene.scene(), camera);
        };
      });
      define()('OnResize', function () {
        return function (newDims) {
          dims = newDims;

          renderer.setSize(dims.usableWidth, dims.usableHeight);
          adapter.setCameraAspectRatio(camera, dims.ratio);
        };
      });
    };
  }
};