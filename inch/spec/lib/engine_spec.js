var rek = require('rekuire');

var Engine = rek("inch/public/js/server_core/engine");

describe("the engine", function() {
	var engine = null;
	var state = {
		paused: false,
		duration: 0
	};
	var logic = {
		update: jasmine.createSpy()
	};
	var input = {
		map_input_to_action: jasmine.createSpy()
	}

	var now = 1000000;

	beforeEach(function() {
		state.duration = 0;
		logic.update.reset();
		input.map_input_to_action.reset();

    	spyOn(Date, 'now').andReturn(now);

		engine = new Engine(state, logic, input);
	});

	describe("when running", function() {
		beforeEach(function() {});

		it("should update the game duration by the delta in seconds", function() {
			engine.step(500000);
			expect(state.duration).toBe(500)
		});

		it("should delegate to input", function() {
			engine.step();
			expect(input.map_input_to_action).toHaveBeenCalled();
		});

		it("should update the game logic with the delta in seconds", function() {
			engine.step(500000);
			expect(logic.update).toHaveBeenCalledWith(500);
		});
	});

	describe("when paused and unpaused", function() {
		it("the delta should be from the last frame and not from when the game was paused", function() {
			state.paused = true;
			engine.step(500000);
			//Having called step the value of prior_step will be equal to 'now', which is the same value that is given on the second call
			expect(state.duration).toBe(0)
			state.paused = false;
			engine.step(500000);
			//So the result should be zero
			expect(state.duration).toBe(500)
		});
	});
});