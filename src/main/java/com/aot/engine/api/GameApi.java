package com.aot.engine.api;

import com.aot.engine.Match;
import com.aot.engine.api.json.CardPlayedJsonResponseBuilder;
import com.aot.engine.api.json.GameApiJson;
import com.aot.engine.board.Board;
import com.aot.engine.board.Square;
import com.aot.engine.cards.movements.MovementsCard;
import com.google.gson.Gson;
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

    private Gson gson = new Gson();
    private GameApiJson.Move move;

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
        move = gson.fromJson(message, GameApiJson.Move.class);

        String response;
        switch (move.getRequestType()) {
            case VIEW_POSSIBLE_SQUARES:
                response = getPossibleSquares();
                break;
            case PLAY:
                response = play();
                break;
            default:
                response = buildBadResponse("Unknow resquest type.");
                break;
        }

        session.getBasicRemote().sendText(response);
    }

    private String getPossibleSquares() {
        if (move.areInputParemetersIncorrect(match)) {
            String message = String
                    .format("Wrong input parameters. CardName: %s. CardColor: %s. PlayerId: %s.",
                            move.getCardName(),
                            move.getCardColor(),
                            move.getPlayerId());
            return buildBadResponse(message);
        } else {
            String cardName = move.getCardName();
            String cardColor = move.getCardColor();
            Square currentSquare = match.getActivePlayerCurrentSquare();
            if (currentSquare == null) {
                return buildBadResponse("Cannot get active player's current square.");
            } else {
                currentSquare.setAsOccupied();

                // Get the card.
                playableCard = match.getActivePlayerDeck().getCard(cardName, cardColor);
                if (playableCard == null) {
                    String message = String.format("Cannot get the selected card: %s, %s.", cardName, cardColor);
                    return buildBadResponse(message);
                } else {
                    List<String> possibleSquaresIds = new ArrayList<>(playableCard.getPossibleMovements(currentSquare));
                    Collections.sort(possibleSquaresIds);
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.add("possible_squares", gson.toJsonTree(possibleSquaresIds));
                    return gson.toJson(jsonResponse);
                }
            }
        }
    }

    private String buildBadResponse(String message) {
        return "{\"error\": \"" + message + "\"}";
    }

    private String play() {
        if (move.pass()) {
            passThisTurn();
        } else if (move.discard() && !move.areInputParemetersIncorrect(match)) {
            discardCard(move);
        } else if (incorrectInputParemeters(move)) {
            String message = String
                    .format("Wrong input parameters. CardName: %s. CardColor: %s. PlayerId: %s. X: %s. Y: %s.",
                            move.getCardName(),
                            move.getCardColor(),
                            move.getPlayerId(),
                            move.getX(),
                            move.getY());
            return buildBadResponse(message);
        } else {
            String cardName = move.getCardName();
            String cardColor = move.getCardColor();
            Square currentSquare = match.getActivePlayerCurrentSquare();
            if (currentSquare == null) {
                String message = "Cannot get active player's current square.";
                return buildBadResponse(message);
            }
            currentSquare.setAsOccupied();

            // Get the card.
            playableCard = match.getActivePlayerDeck().getCard(cardName, cardColor);
            if (playableCard == null) {
                String message = String.format("Cannot get the selected card: %s, %s.", cardName, cardColor);
                return buildBadResponse(message);
            }

            List<String> possibleSquaresIds = new ArrayList<>(playableCard.getPossibleMovements(currentSquare));

            int x = move.getX();
            int y = move.getY();
            String selectedSquareId = String.format("square-%s-%s", x, y);
            if (!possibleSquaresIds.contains(selectedSquareId)) {
                String message = "Invalid square.";
                return buildBadResponse(message);
            }

            match.playTurn(x, y, playableCard);

            return "{\"play\": " + CardPlayedJsonResponseBuilder.build(match, x, y) + "}";
        }

        return null;
    }

    private String passThisTurn() {
        match.passThisTurn();
        return CardPlayedJsonResponseBuilder.build(match);
    }

    private String discardCard(GameApiJson.Move move) {
        String cardName = move.getCardName();
        String cardColor = move.getCardColor();
        MovementsCard cardToDiscard = match.getActivePlayerDeck().getCard(cardName, cardColor);
        if (cardToDiscard == null) {
            String message = String.format("Unknown card: %s, %s", cardName, cardColor);
            return buildBadResponse(message);
        }

        match.discard(cardToDiscard);
        return CardPlayedJsonResponseBuilder.build(match);
    }

    private boolean incorrectInputParemeters(GameApiJson.Move move) {
        return move.areInputParemetersIncorrect(match) || incorrectCoordinates(move);
    }

    private boolean incorrectCoordinates(GameApiJson.Move move) {
        return move.getX() == null || move.getY() == null;
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
