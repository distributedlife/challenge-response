var expect = require('expect');
var sinon = require('sinon');

var mutateSpy = sinon.spy();
var mutate = function () {
  return mutateSpy;
}
var f = function(state) {
  return { v: 9 }
}
var state = function() {
  return 1;
};
var invoker = require("../src/index.js").func(mutate);

describe("the behavour invoker", function () {
  beforeEach(function () {
    mutateSpy.reset();
  });

  it("should turn optional data that is an array into individual params", function () {
    var spy = sinon.spy();
    invoker(spy, state, [1, 2]);

    expect(spy.firstCall.args).toEqual([state, 1, 2])
  });

  it("should handle non-array optional data", function () {
    var spy = sinon.spy();
    invoker(spy, state, 2);

    expect(spy.firstCall.args).toEqual([state, 2])
  });

  it("should handle no optional data", function () {
    var spy = sinon.spy();
    invoker(spy, state);

    expect(spy.firstCall.args).toEqual([state])
  });

  it("send the supplied state to the function", function () {
    var stateSpy = sinon.spy();
    var func = function (state) {
      state();
    }
    invoker(func, stateSpy);

    expect(stateSpy.called).toEqual(true);
  });

  it("send the changed state to the mutator", function () {
    invoker(f, state);
    expect(mutateSpy.firstCall.args).toEqual([{v: 9}])
  });
});

describe("integration tess", function () {
  it("should all wire together", function () {
    var pluginManager = require("../../inch-plugins/src/plugin_manager.js").PluginManager;
    pluginManager.load(require("../../inch-plugin-state-mutator-default/src/index.js"));
    pluginManager.load(require("../src/index.js"));

    var stateAccess = pluginManager.get("StateAccess");
    stateAccess.add("int", {val: 0})

    var invoker = pluginManager.get("BehaviourInvoker");
    var f = function (int) {
      return {
        int: {
          val: int("val") + 1
        }
      };
    };

    invoker(f, stateAccess.get("int"));
    expect(stateAccess.get("int")("val")).toEqual(1);
  });
});