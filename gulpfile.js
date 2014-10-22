var gulp = require('gulp');
var server = require( 'gulp-develop-server' );
var livereload = require ('gulp-livereload');

gulp.task( 'server:start', function() {
    server.listen( { path: './server.js' }, livereload.listen );
});

gulp.task( 'server:restart', [ 'server:start' ], function() {

	function restart( file ) {
        server.changed( function( error ) {
            if( ! error ) livereload.changed( file.path );
        });
    }

    gulp.watch( [ './server.js', "game/js/**/*.js", "inch/public/js/**/*.js" ] ).on( 'change', restart );
});