import { runCLI } from "@jest/core";
import path from "path";
import project from "../aurelia.json";

import { CLIOptions } from "aurelia-cli";

export default cb => {
    let options = project.testFramework.config;

    Object.assign(options, {
        collectCoverage: CLIOptions.hasFlag("coverage"),
        watch: CLIOptions.hasFlag("watch"),
    });

    if (CLIOptions.getFlagValue("test-path-pattern")) {
        Object.assign(options, { testPathPattern: [CLIOptions.getFlagValue("test-path-pattern")] });
    }

    process.env.BABEL_TARGET = "node";

    runCLI(options, [path.resolve(__dirname, "../../")]).then(({ results }) => {
        if (results.numFailedTests || results.numFailedTestSuites) {
            cb("Tests Failed");
        } else {
            // For an unknown reason, on gitlab, the test process won't exit. So we help it a little.
            if (process.env.CI_SERVER === "yes") {
                process.exit(0);
            }
            cb(null);
        }
    });
};
