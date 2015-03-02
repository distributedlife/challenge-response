var expect = require("expect");
var GameState = require('../src/state.js');

describe("the initial state", function() {
  it("can be received as is", function() {
    var state = new GameState();

    expect(state.players).toBe(0);
    expect(state.observers).toBe(0);
    expect(state.paused).toBe(true);
    expect(state.dimensions).toEqual({width: 1000, height: 500});
    expect(state.wireframes).toEqual([]);
  });

  it("can be extended", function() {
    var state = new GameState({my: "data"});

    expect(state.players).toBe(0);
    expect(state.observers).toBe(0);
    expect(state.paused).toBe(true);
    expect(state.dimensions).toEqual({width: 1000, height: 500});
    expect(state.wireframes).toEqual([]);
    expect(state.my).toEqual("data");
  });

  it("has a callback for getting the value of paused", function() {
    var state = new GameState();
    expect(state.isPaused()).toBe(true);
  });
});

describe("when a player connects", function() {
  var state;

  beforeEach(function() {
    state = new GameState();
    state.playerConnected();
  });

  it("should increase the player count", function() {
    expect(state.players).toBe(1)
  });
});

describe("when a player disconnects", function() {
  var state;

  beforeEach(function() {
    state = new GameState();
    state.players = 1;
    state.paused = false;
    state.playerDisconnected();
  });

  it("should descrease the player count", function() {
    expect(state.players).toBe(0);
  });

  it("should pause the game", function() {
    expect(state.paused).toBe(true);
  });
});

describe("when an observer connects", function() {
  var state;

  beforeEach(function() {
    state = new GameState();
    state.observerConnected();
  });

  it("should increase the observer count", function() {
    expect(state.observers).toBe(1);
  });
});

describe("when an observer disconnects", function() {
  var state;

  beforeEach(function() {
    state = new GameState();
    state.observers = 1;
    state.observerDisconnected();
  });

  it("should descrease the observer count", function() {
    expect(state.observers).toBe(0);
  });
});

describe("when paused", function() {
  var state;

  beforeEach(function() {
    state = new GameState();
    state.paused = false;
    state.pause();
  });

  it("should set pause to true", function() {
    expect(state.paused).toBe(true);
  });
});

describe("when unpaused", function() {
  var state;

  beforeEach(function() {
    state = new GameState();
    state.paused = true;
    state.unpause();
  });

  it("should set pause to false", function() {
    expect(state.paused).toBe(false);
  });
});