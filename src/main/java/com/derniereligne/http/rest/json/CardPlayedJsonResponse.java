package com.derniereligne.http.rest.json;

import com.derniereligne.engine.cards.trumps.json.JsonTrump;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author jenselme
 */
public class CardPlayedJsonResponse {

    private static final String PLAYER_NAME_KEY = "name";
    private static final String PLAYER_ID_KEY = "id";

    private String newSquare;
    private Map<String, String> nextPlayer;
    private List<Map<String, String>> possibleCardsNextPlayer;
    private boolean gameOver;
    private List<String> winners;
    private List<JsonTrump> trumpsNextPlayer;
    private List<Map<String, String>> players;
    private List<TrumpPlayedJsonResponse> trumps;

    public Map<String, String> getNextPlayer() {
        return nextPlayer;
    }

    public void init() {
        this.nextPlayer = new HashMap<>();
        this.possibleCardsNextPlayer = new ArrayList<>();
    }

    public void setNextPlayerName(String name) {
        nextPlayer.put(PLAYER_NAME_KEY, name);
    }

    public void setNexPlayerId(String id) {
        nextPlayer.put(PLAYER_ID_KEY, id);
    }

    public List<Map<String, String>> getPossibleCardsNextPlayer() {
        return possibleCardsNextPlayer;
    }

    public void setPossibleCardsNextPlayer(List<Map<String, String>> possibleCardsNextPlayer) {
        this.possibleCardsNextPlayer = possibleCardsNextPlayer;
    }

    public void setNewSquare(String newSquare) {
        this.newSquare = newSquare;
    }

    public String getNextPlayerId() {
        return nextPlayer.get(PLAYER_ID_KEY);
    }

    public String getNextPlayerName() {
        return nextPlayer.get(PLAYER_NAME_KEY);
    }

    public int getNumberCardsNextPlayer() {
        return possibleCardsNextPlayer.size();
    }

    public void setGameOver(boolean gameOver) {
        this.gameOver = gameOver;
    }

    public void setWinners(List<String> winners) {
        this.winners = winners;
    }

    public List<JsonTrump> getTrumpsNextPlayer() {
        return this.trumpsNextPlayer;
    }

    public void setTrumpsNextPlayer(List<JsonTrump> trumps) {
        this.trumpsNextPlayer = trumps;
    }

    public void setPlayers(List<Map<String, String>> players) {
        this.players = players;
    }

    public void setTrumps(List<TrumpPlayedJsonResponse> trumps) {
        this.trumps = trumps;
    }

}
