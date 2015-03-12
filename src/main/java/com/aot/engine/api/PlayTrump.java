package com.aot.engine.api;

import com.aot.engine.trumps.Trump;
import com.aot.engine.api.json.TrumpPlayedJsonResponseBuilder;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.NoSuchElementException;
import javax.websocket.OnMessage;
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
@ServerEndpoint(value="/api/playTrump/{id}",  configurator=GetHttpSessionConfigurator.class)
public class PlayTrump extends GameApiOld {

    private class WsTrump {
        private String name;
        private Integer targetIndex;

        public String getName() {
            return name;
        }

        public Integer getTargetIndex() {
            return targetIndex;
        }
    }

    private WsTrump wsTrump;
    private Trump trump;

    @OnMessage
    public void play(@PathParam("id") String id, String message, Session session) throws IOException {
        this.gameId = id;
        Gson gson = new Gson();
        wsTrump = gson.fromJson(message, WsTrump.class);
        session.getBasicRemote().sendText(getGameFactoryResponse());
    }

    @Override
    protected String checkParametersAndGetResponse() {
        trump = getTrump();
        if (trump == null) {
            String message = String
                    .format("Wrong input parameters. trumpName: %s., targetIndex: %s.",
                            wsTrump.getName(),
                            wsTrump.getTargetIndex());
            return buildBadResponse(message);
        }

        return getResponse();
    }

    /**
     * Get the trump by the given name or null if the trump doesn't exist.
     *
     * @return The trump.
     */
    private Trump getTrump() {
        String trumpName = wsTrump.getName();
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

    @Override
    protected String getResponse() {
        if (match.canActivePlayerPlayTrump(trump)) {
            match.playTrump(trump);
            return TrumpPlayedJsonResponseBuilder.build(match);
        }

        int targetIndex = wsTrump.getTargetIndex();
        if (match.canActivePlayerPlayTrump(trump, targetIndex)) {
            match.playTrump(trump, targetIndex);
            return TrumpPlayedJsonResponseBuilder.build(match);
        }

        String message = "You cannot play this trump.";
        return buildBadResponse(message);
    }

}
