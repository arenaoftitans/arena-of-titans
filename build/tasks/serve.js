var historyApiFallback = require('connect-history-api-fallback');
var gulp = require('gulp');
var browserSync = require('browser-sync');


gulp.task('serve', ['build'], function (done) {
    browserSync({
        port: 8282,
        online: false,
        open: false,
        ghostMode: false,
        server: {
            baseDir: ['.'],
            middleware: [function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }, historyApiFallback()]
        }
    }, done);
}).help = 'start a small server to ease devolopment of the frontend';
