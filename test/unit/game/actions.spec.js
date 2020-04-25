/*
 * Copyright (C) 2015-2020 by Arena of Titans Contributors.
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
 *
 */

import { createStore, gameUpdatedYourTurn, lobbyJoined, playerUpdatedYourTurn } from "../fixtures";

describe("actions", () => {
    let mockedStore;
    let mockedState;
    let subscription;

    beforeEach(() => {
        mockedStore = createStore();
        subscription = mockedStore.state.subscribe(state => (mockedState = state));
    });

    afterEach(() => {
        subscription.unsubscribe();
    });

    it("Update game state once lobby is joined", async () => {
        await mockedStore.dispatch("lobbyJoined", lobbyJoined.request);

        expect(mockedState).toMatchSnapshot();
    });

    it("Update state when game and player is updated", async () => {
        await mockedStore.dispatch("gameUpdated", gameUpdatedYourTurn.request);
        await mockedStore.dispatch("playerUpdated", playerUpdatedYourTurn.request);

        expect(mockedState).toMatchSnapshot();
    });
});
