/*
 * Copyright (C) 2017 by Arena of Titans Contributors.
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

export default class RollbarAppender {
    debug(logger, ...rest) {
        let mainArgs = rest[0];
        Rollbar.debug(`DEBUG [${logger.id}]: ${mainArgs}`, this._formatRest(rest));
    }

    info(logger, ...rest) {
        let mainArgs = rest[0];
        Rollbar.info(`INFO [${logger.id}]  ${mainArgs}`, this._formatRest(rest));
    }

    warn(logger, ...rest) {
        let mainArgs = rest[0];
        Rollbar.warn(`WARN [${logger.id}] ${mainArgs}`, this._formatRest(rest));
    }

    error(logger, ...rest) {
        let mainArgs = rest[0];
        Rollbar.error(`ERROR [${logger.id}]  ${mainArgs}`, this._formatRest(rest));
    }

    _formatRest(rest) {
        try {
            return JSON.stingify({ extra: rest.slice(1) });
        } catch (e) {
            return undefined;
        }
    }
}
