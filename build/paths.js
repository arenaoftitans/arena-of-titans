var appRoot = 'app/';
var assetsRoot = 'assets/';
var outputRoot = 'dist/';
var stylesRoot = 'style/';


module.exports = {
    root: appRoot,
    images: assetsRoot + '**/*.png',
    css: stylesRoot + '**/*.css',
    html: appRoot + '**/*.html',
    source: appRoot + '**/*.js',
    output: outputRoot,
    outputImg: outputRoot + 'img/'
};
