var morgan = require('morgan');
var bodyParser = require('body-parser')

module.exports = function(app, express, engines) {
	app.use('/inch', express.static(__dirname + '/public/'));
	app.use('/game', express.static(__dirname + '/../game'));
	app.use(morgan('combined'));
	app.use(bodyParser.urlencoded({extended: true }));
	app.use(bodyParser.json());
	app.set('view options', {layout: false});
	app.set('views', __dirname + '/public/views');
	app.engine('haml', engines.haml);
};