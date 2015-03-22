package com.aot.engine.api.json;

import static com.aot.engine.api.RequestType.PLAY;
import com.aot.engine.trumps.json.JsonTrump;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author jenselme
 */
public class CardPlayedJsonResponse {

    private Map<String, Integer> newSquare;
    private JsonPlayer nextPlayer;
    private List<Map<String, String>> possibleCardsNextPlayer;
    private boolean gameOver;
    private List<String> winners;
    private List<JsonTrump> trumpsNextPlayer;
    private List<JsonPlayer> players;
    private List<TrumpJson> trumps;
    private String rt = PLAY.toString();

    public JsonPlayer getNextPlayer() {
        return nextPlayer;
    }

    public void init() {
        this.nextPlayer = new JsonPlayer();
        this.possibleCardsNextPlayer = new ArrayList<>();
    }

    public void setNextPlayerName(String name) {
        nextPlayer.setName(name);
    }

    public void setNexPlayerId(String id) {
        nextPlayer.setId(id);
    }

    public List<Map<String, String>> getPossibleCardsNextPlayer() {
        return possibleCardsNextPlayer;
    }

    public void setPossibleCardsNextPlayer(List<Map<String, String>> possibleCardsNextPlayer) {
        this.possibleCardsNextPlayer = possibleCardsNextPlayer;
    }

    public void setNewSquare(int x, int y) {
        this.newSquare = new HashMap<>();
        this.newSquare.put("x", x);
        this.newSquare.put("y", y);
    }

    public String getNextPlayerId() {
        return nextPlayer.getId();
    }

    public int getNextPlayerIndex() {
        return nextPlayer.getIndex();
    }

    public void setNextPlayerIndex(int index) {
        nextPlayer.setIndex(index);
    }

    public String getNextPlayerName() {
        return nextPlayer.getName();
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

    public void setPlayers(List<JsonPlayer> players) {
        this.players = players;
    }

    public void setTrumps(List<TrumpJson> trumps) {
        this.trumps = trumps;
    }

}
