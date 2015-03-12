package com.aot.engine.api;

import com.aot.engine.Match;
import com.aot.engine.api.json.GameApiJson;
import com.aot.engine.board.Board;
import com.aot.engine.board.Square;
import com.aot.engine.cards.movements.MovementsCard;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.websocket.CloseReason;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@ServerEndpoint(value = "/api/game/{id}")
public class GameApi {

    private static final String POSSIBLE_SQUARES = "possible_squares";

    /**
     * The Match the user is playing.
     */
    protected Match match;
    /**
     * The Board he is playing on.
     */
    protected Board board;
    /**
     * The last card played.
     */
    protected MovementsCard playableCard;
    protected String gameId;

    // The JSON to be send to the client.
    private String response;

    @OnOpen
    public void open(@PathParam("id") String id, Session session) throws IOException {
        gameId = id;
        retrieveMatch();

        if (match == null) {
            CloseReason.CloseCode cc = () -> 404;
            CloseReason cr = new CloseReason(cc, "No match is running");
            session.close(cr);
        }
    }

    private void retrieveMatch() {
        JedisPool pool = new JedisPool(new JedisPoolConfig(), Redis.SERVER_HOST);
        try (Jedis jedis = pool.getResource()) {
            String matchJson = jedis.hget(Redis.GAME_KEY_PART + gameId,
                    Redis.MATCH_KEY);
            match = Match.fromJson(matchJson);
        }

        pool.destroy();
    }

    @OnMessage
    public void gameResponse(@PathParam("id") String id, String message, Session session)
            throws IOException {

        Gson gson = new Gson();
        JsonObject data = gson.fromJson(message, JsonElement.class).getAsJsonObject();

        if (data.has(POSSIBLE_SQUARES)) {
            data = data.get(POSSIBLE_SQUARES).getAsJsonObject();
            getPossibleSquares(data);
        }

        session.getBasicRemote().sendText(response);
    }

    private void getPossibleSquares(JsonObject data) {
        Gson gson = new Gson();
        GameApiJson.Move move = gson.fromJson(data, GameApiJson.Move.class);
        if (move.areInputParemetersIncorrect(match)) {
            String message = String
                    .format("Wrong input parameters. CardName: %s. CardColor: %s. PlayerId: %s.",
                            move.getCardName(),
                            move.getCardColor(),
                            move.getPlayerId());
            response = buildBadResponse(message);
        } else {
            String cardName = move.getCardName();
            String cardColor = move.getCardColor();
            Square currentSquare = match.getActivePlayerCurrentSquare();
            if (currentSquare == null) {
                response = buildBadResponse("Cannot get active player's current square.");
            } else {
                currentSquare.setAsOccupied();

                // Get the card.
                playableCard = match.getActivePlayerDeck().getCard(cardName, cardColor);
                if (playableCard == null) {
                    String message = String.format("Cannot get the selected card: %s, %s.", cardName, cardColor);
                    response = buildBadResponse(message);
                } else {
                    List<String> possibleSquaresIds = new ArrayList<>(playableCard.getPossibleMovements(currentSquare));
                    Collections.sort(possibleSquaresIds);
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.add(POSSIBLE_SQUARES, gson.toJsonTree(possibleSquaresIds));
                    response = gson.toJson(jsonResponse);
                }
            }
        }
    }

    private String buildBadResponse(String message) {
        return "{\"error\": \"" + message + "\"}";
    }

    private void saveMatch() {
        JedisPool pool = new JedisPool(new JedisPoolConfig(), Redis.SERVER_HOST);
        try (Jedis jedis = pool.getResource()) {
            String matchJson = match.toJson();
            jedis.hset(Redis.GAME_KEY_PART + gameId,
                    Redis.MATCH_KEY, matchJson);
            jedis.expire(Redis.GAME_KEY_PART + gameId, Redis.GAME_EXPIRE);
        }
        pool.destroy();
    }

}
