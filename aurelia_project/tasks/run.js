import gulp from 'gulp';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback/lib';
import {CLIOptions} from 'aurelia-cli';
import proxy from 'proxy-middleware';
import url from 'url';
import project from '../aurelia.json';
import build from './build';
import watch from './watch';

let serve = gulp.series(
  build,
  done => {
    let proxyOptions = url.parse('http://localhost:8282/');
    proxyOptions.route = '/latest';

    browserSync({
      online: false,
      open: false,
      port: 8282,
      logLevel: 'silent',
      ghostMode: false,
      server: {
        baseDir: [project.platform.baseDir],
        middleware: [historyApiFallback(), proxy(proxyOptions), (req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }]
      }
    }, function (err, bs) {
      if (err) return done(err);
      let urls = bs.options.get('urls').toJS();
      log(`Application Available At: ${urls.local}`);
      log(`BrowserSync Available At: ${urls.ui}`);
      done();
    });
  }
);

function log(message) {
  console.log(message); //eslint-disable-line no-console
}

function reload() {
  log('Refreshing the browser');
  browserSync.reload();
}

let run;

if (CLIOptions.hasFlag('watch')) {
  run = gulp.series(
    serve,
    done => { watch(reload); done(); }
  );
} else {
  run = serve;
}

export default run;
