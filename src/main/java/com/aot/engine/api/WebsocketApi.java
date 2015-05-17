package com.aot.engine.api;

import com.aot.engine.Match;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.Session;

public abstract class WebsocketApi {

    protected static final Map<String, Session> players
            = Collections.synchronizedMap(new HashMap<String, Session>());
    protected static Redis redis = Redis.getInstance();

    protected Match match;
    protected String gameId;

    protected void sendResponseToAllPlayers(String response, String... excludedPlayers)
            throws IOException {
        Set<String> excludedPlayersSet = new HashSet<>();
        Collections.addAll(excludedPlayersSet, excludedPlayers);
        sendResponseToAllPlayers(response, excludedPlayersSet);
    }

    protected void sendResponseToAllPlayers(String response, Set<String> excludedPlayers)
            throws IOException {
        for (String sessionId : redis.getPlayersIds(gameId)) {
            if (!excludedPlayers.contains(sessionId)) {
                sendResponse(response, sessionId);
            }
        }
    }

    protected void sendResponse(String response, String sessionId) throws IOException {
        if (response == null) {
            return;
        }

        try {
            Session session = players.get(sessionId);
            session.getBasicRemote().sendText(response);
        } catch (NullPointerException exp) {
            Logger.getLogger(GameApi.class.getCanonicalName())
                    .log(Level.WARNING, "A websocket was not found: {0}", sessionId);
            removeSessionId(sessionId);
        }
    }

    protected void sendResponseToAllPlayers(String response) throws IOException {
        sendResponseToAllPlayers(response, new HashSet<>());
    }

    protected void removeSessionId(String sessionId) {
        players.remove(sessionId);
        redis.removeSessionId(gameId, sessionId);
    }

}
