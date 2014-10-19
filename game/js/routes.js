var rek = require("rekuire");

module.exports = function(app, game_state) {
	var default_routes = rek('default_routes')(app, game_state);
	
	default_routes.configure("game/levels/default");
};
