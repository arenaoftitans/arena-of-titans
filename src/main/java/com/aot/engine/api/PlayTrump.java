package com.aot.engine.api;

import com.aot.engine.Match;
import com.aot.engine.api.json.GameApiJson;
import com.aot.engine.trumps.Trump;
import com.aot.engine.api.json.TrumpPlayedJsonResponseBuilder;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.NoSuchElementException;
import javax.websocket.EndpointConfig;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

/**
 * <b>Rest servlet that plays a trump card.</b>
 *
 * Expect parameters: card_name.
 *
 * @author jenselme
 */
@ServerEndpoint(value = "/api/playTrump/{id}", configurator = GetRedis.class)
public class PlayTrump {

    private GameApiJson.PlayTrumpRequest playTrumpRequest;
    private Redis redis;
    private String gameId;
    private Match match;

    @OnOpen
    public void open(@PathParam("id") String id, Session session, EndpointConfig config) {
        gameId = id;
        redis = (Redis) config.getUserProperties().get(Redis.REDIS_SERVLET);
        match = redis.getMatch(gameId);
    }

    @OnMessage
    public void play(String message, Session session) throws IOException {
        String response;
        Gson gson = new Gson();
        playTrumpRequest = gson.fromJson(message, GameApiJson.PlayTrumpRequest.class);
        match = redis.getMatch(gameId);

        if (playTrumpRequest.isIdCorrect(match)) {
            response = playTrump();
        } else {
            response = GameApiJson.buildErrorToDisplay("Not your turn.");
        }

        redis.saveMatch(match);
        session.getBasicRemote().sendText(response);
    }

    private String playTrump() {
        String response;
        Trump trump = getTrump();
        if (trump != null) {
            response = playThisTrump(trump);
        } else {
            String message = String
                    .format("Wrong input parameters. trumpName: %s., targetIndex: %s.",
                            playTrumpRequest.getTrumpName(),
                            playTrumpRequest.getTargetIndex());
            response = GameApiJson.buildError(message);
        }

        return response;
    }

    private Trump getTrump() {
        String trumpName = playTrumpRequest.getTrumpName();
        if (trumpName == null) {
            return null;
        } else {
            try {
                return match.getTrumpForActivePlayer(trumpName);
            } catch (NoSuchElementException ex) {
                return null;
            }
        }
    }

    private String playThisTrump(Trump trump) {
        String response;
        Integer targetIndex = playTrumpRequest.getTargetIndex();

        if (match.canActivePlayerPlayTrump(trump, targetIndex)) {
            match.playTrump(trump, targetIndex);
            response = TrumpPlayedJsonResponseBuilder.build(match);
        } else {
            response = GameApiJson.buildError("You cannot play this trump.");
        }

        return response;
    }

}
