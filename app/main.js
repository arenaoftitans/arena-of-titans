/*
 * Copyright (C) 2015-2020 by Last Run Contributors.
 *
 * This file is part of Arena of Titans.
 *
 * Arena of Titans is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Arena of Titans is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Arena of Titans. If not, see <http://www.gnu.org/licenses/>.
 */

import { AppRouter } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import * as Logger from "aurelia-logging";
import { PLATFORM } from "aurelia-pal";
import XHR from "i18next-xhr-backend";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import environment from "../config/environment.json";
import enTranslations from "./locale/en/translations";
import frTranslations from "./locale/fr/translations";

export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .plugin(PLATFORM.moduleName("aurelia-animator-css"))
        .plugin(PLATFORM.moduleName("aurelia-piwik"))
        .plugin(PLATFORM.moduleName("aurelia-i18n"), instance => {
            let language = navigator.language.split("-")[0];

            // register backend plugin
            instance.i18next.use(XHR);

            function loadLocales(url, options, callback, data) {
                switch (url) {
                    case "en":
                        callback(enTranslations, { status: "200" });
                        break;
                    case "fr":
                        callback(frTranslations, { status: "200" });
                        break;
                    default:
                        callback(null, { status: "404" });
                        break;
                }
            }

            return instance
                .setup({
                    backend: {
                        loadPath: "{{lng}}",
                        parse: data => data,
                        ajax: loadLocales,
                    },
                    lng: language,
                    attributes: ["t", "i18n"],
                    fallbackLng: "en",
                    debug: false,
                })
                .then(() => {
                    const router = aurelia.container.get(AppRouter);
                    router.transformTitle = title => instance.tr(title);

                    const eventAggregator = aurelia.container.get(EventAggregator);
                    eventAggregator.subscribe("i18n:locale:changed", () => {
                        router.updateTitle();
                    });
                });
        })
        .plugin(PLATFORM.moduleName("aurelia-store"), {
            initialState: { game: {}, lobby: {}, currentTurn: {}, me: {} },
            logDispatchedActions: environment.debug,
            logDefinitions: {
                dispatchedActions: "debug",
            },
            history: {
                undoable: false,
                limit: environment.debug ? undefined : 20,
            },
        });

    if (environment.debug) {
        aurelia.use.developmentLogging();
    } else {
        // Production logging is inspired by developmentLogging
        aurelia.use.preTask(() => {
            return aurelia.loader
                .normalize("aurelia-logging-console", aurelia.bootstrapperName)
                .then(name => {
                    return aurelia.loader.loadModule(name).then(m => {
                        if (environment.sentry_dsn) {
                            console.debug("Sentry is setup."); // eslint-disable-line no-console
                            Sentry.init({
                                dsn: environment.sentry_dsn,
                                release: environment.version,
                                environment: environment.env,
                                integrations: [
                                    new Integrations.CaptureConsole({
                                        levels: ["warn"],
                                    }),
                                ],
                            });
                        } else {
                            console.warn("No DSN found for Sentry."); // eslint-disable-line no-console
                        }

                        Logger.addAppender(new m.ConsoleAppender());
                        Logger.setLevel(Logger.logLevel.warn);
                    });
                });
        });
    }

    if (environment.testing) {
        aurelia.use.plugin(PLATFORM.moduleName("aurelia-testing"));
    }

    aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName("app")));
}
