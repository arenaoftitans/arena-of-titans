var appRoot = 'app/';
var assetsRoot = 'assets/';
var outputRoot = 'dist/';
var prodOutputRoot = 'public/';
var stylesRoot = 'style/';


module.exports = {
    root: appRoot,
    images: assetsRoot + '**/*.png',
    css: stylesRoot + '**/*.css',
    fonts: stylesRoot + 'fonts/**/*',
    html: appRoot + '**/*.html',
    source: appRoot + '**/*.js',
    output: outputRoot,
    outputImg: outputRoot + 'img/',
    prodOutput: prodOutputRoot,
    prodOutputDist: prodOutputRoot + 'dist/'
};
