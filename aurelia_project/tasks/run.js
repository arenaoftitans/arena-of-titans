import gulp from "gulp";
import browserSync from "browser-sync";
import historyApiFallback from "connect-history-api-fallback/lib";
import { CLIOptions } from "aurelia-cli";
import project from "../aurelia.json";
import build from "./build";
import watch from "./watch";
import { cleanDist } from "./utils";

let serve = gulp.series(build, done => {
    browserSync(
        {
            online: false,
            open: false,
            port: 8282,
            logLevel: "silent",
            ghostMode: false,
            server: {
                baseDir: [project.platform.baseDir],
                middleware: [
                    historyApiFallback(),
                    (req, res, next) => {
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.setHeader("Cache-Control", "no-cache");
                        next();
                    },
                ],
            },
        },
        function(err, bs) {
            if (err) return done(err);
            let urls = bs.options.get("urls").toJS();
            log(`Application Available At: ${urls.local}`);
            log(`BrowserSync Available At: ${urls.ui}`);
            done();
        },
    );
});

function log(message) {
    console.log(message); //eslint-disable-line no-console
}

function reload() {
    log("Refreshing the browser");
    browserSync.reload();
}

const steps = [cleanDist, serve];

if (CLIOptions.hasFlag("watch")) {
    steps.push(done => {
        watch(reload);
        done();
    });
}

const run = gulp.series(...steps);

export default run;
