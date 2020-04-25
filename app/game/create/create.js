/*
 * Copyright (C) 2015-2016 by Arena of Titans Contributors.
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

import * as LogManager from "aurelia-logging";
import { inject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { Router } from "aurelia-router";
import { BindingEngineSubscriptions, Wait, randomInt } from "../services/utils";
import { AssetSource } from "../../services/assets";
import { Storage } from "../services/storage";
import environment from "../../environment";
import * as lobbyActions from "../actions/lobby";

@inject(Router, Store, Storage, BindingEngineSubscriptions)
export class Create {
    _router;

    constructor(router, store, storage, bes) {
        this._router = router;
        this._store = store;
        this._storage = storage;
        this._bes = bes;
        this.assetSource = AssetSource;
        this._logger = LogManager.getLogger("aot:create");

        this.currentPlayerName = "";
        this.currentHero = "";
        this.gameId = null;
        this.mySlot = {};
        this.lobby = {
            joining: true,
        };
    }

    updateMySlot() {
        this.updateSlot({
            ...this.mySlot,
            playerName: this.currentPlayerName,
            hero: this.currentHero,
        });
    }

    _getNavParams(gameId) {
        return { id: this.gameId || gameId, version: environment.version };
    }

    activate(params = {}) {
        this.subscription = this._store.state.subscribe(state => this._updateLocalState(state));

        Wait.flushCache();
        this._bes.subscribe(this, "currentHero", (newValue, oldValue) => {
            if (oldValue === "") {
                // We are initializing the game, don't dispatch an update.
                return;
            }
            this.updateMySlot();
        });

        if (!params.id) {
            this._logger.debug("Creating lobby.");
            this._store.dispatch(lobbyActions.createLobby, this._storage.loadPlayerInfos());
        } else if (!this.gameId) {
            const playerId = this._storage.retrievePlayerId(params.id);
            if (playerId) {
                this._logger.debug("Reconnecting to lobby.");
                this._store.dispatch("reconnect", params.id, playerId);
            } else {
                this._logger.debug("Joining lobby.");
                this._store.dispatch(
                    lobbyActions.joinGame,
                    params.id,
                    this._storage.loadPlayerInfos(),
                );
            }
        }
    }

    _updateLocalState(globalState) {
        this.lobby = globalState.lobby;

        if (!(globalState && globalState.game && globalState.game.id)) {
            return;
        } else if (globalState.game.players) {
            this._router.navigateToRoute("play", this._getNavParams(globalState.game.id));
            return;
        }

        this.mySlot = this.lobby.slots ? this.lobby.slots[globalState.me.index] : {};

        // Hydrate only at first, once done, they will be synced with the API anyway.
        if (!this.currentPlayerName) {
            this.currentPlayerName = this.mySlot.playerName;
        }
        if (!this.currentHero) {
            this.currentHero = this.mySlot.hero;
        }
        this._storage.savePlayerInfos({
            name: this.mySlot.playerName,
            hero: this.mySlot.hero,
        });
        this._storage.saveGameData(globalState.game.id, {
            playerId: globalState.me.id,
            apiVersion: environment.api.version,
        });

        if (this.gameId === null) {
            this.gameId = globalState.game.id;
            this._router.navigateToRoute("create", this._getNavParams());
            this._autoAddAi();
        }
    }

    _autoAddAi() {
        // auto set the 2nd slot to an AI so the player can start the game immediately.
        let takenSlots = this.lobby.slots
            ? this.lobby.slots.filter(slot => slot.state === "TAKEN")
            : [];
        if (this.lobby.isGameMaster && takenSlots.length === 1) {
            this._logger.info("Auto adding AI player");
            const slot = { ...this.lobby.slots[1] };
            slot.state = "AI";
            this.updateSlot(slot);
        }
    }

    updateSlot = slot => {
        if (slot.state === "AI") {
            slot.playerName = `AI ${slot.index}`;
            slot.hero = environment.heroes[randomInt(0, environment.heroes.length - 1)];
        }

        this._store.dispatch(lobbyActions.updateSlot, slot);
    };

    createGame() {
        this._store.dispatch(lobbyActions.createGame);
    }

    deactivate() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this._bes.dispose();
    }

    get gameUrl() {
        return window.location.href;
    }

    get canCreateGame() {
        if (!this.lobby.slots) {
            return false;
        }

        return (
            this.lobby.slots.filter(slot => slot.state === "TAKEN" || slot.state === "AI").length >=
            2
        );
    }
}
