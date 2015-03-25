/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aot.engine.lobby;

import com.aot.engine.Player;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 * @author gaussreload
 */
public class LobbyList {
    private List<Lobby> lobbyList;
    private List<Lobby> playingLobbies;

    public LobbyList() {
        this.lobbyList = new ArrayList<>();
        this.playingLobbies = new ArrayList<>();
    }

    public boolean addLobby(Lobby lobbyToAdd) {
        List<Lobby> lobbysWithId = lobbyList.parallelStream()
                .filter(lobby -> lobby.getLobbyId().equals(lobbyToAdd.getLobbyId()))
                .collect(Collectors.toList());
        if (lobbysWithId.isEmpty()) {
            lobbyList.add(lobbyToAdd);
            return true;
        } else {
            return false;
        }
    }

    private Lobby getLobbyFromId(String lobbyId) {
        List<Lobby> lobbysWithId = lobbyList.parallelStream()
                .filter(lobby -> lobby.getLobbyId().equals(lobbyId))
                .collect(Collectors.toList());
        if (lobbysWithId.isEmpty()) {
            return null;
        } else {
            return lobbysWithId.get(0);
        }
    }

    public boolean joinLobby(String lobbyId, Player player) {
        List<Lobby> lobbysWithId = lobbyList.parallelStream()
                .filter(lobby -> lobby.getLobbyId().equals(lobbyId))
                .collect(Collectors.toList());
        if (lobbysWithId.isEmpty() || lobbysWithId.size() > 1) {
            return false;
        } else {
            return joinLobby(lobbysWithId.get(0), player);
        }
    }

    private boolean joinLobby(Lobby lobbyToJoin, Player player) {
        if (!lobbyToJoin.canBePubliclyJoined()) {
            return false;
        } else {
            lobbyToJoin.addPublicPlayer(player);
            return true;
        }
    }

    private void moveLobbyToPlaying(Lobby lobbyToMove) {
        lobbyList.remove(lobbyToMove);
        playingLobbies.add(lobbyToMove);
    }

    public List<Lobby> getLobbyList() {
        return lobbyList;
    }
}
