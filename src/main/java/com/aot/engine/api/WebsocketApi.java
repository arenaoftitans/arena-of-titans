package com.aot.engine.api;

import com.aot.engine.Match;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.Session;

public abstract class WebsocketApi {

    protected static final Map<String, Session> players
            = Collections.synchronizedMap(new HashMap<String, Session>());

    protected Redis redis;
    protected Match match;
    protected String gameId;

    protected void sendResponseToAllPlayers(String response) throws IOException {
        for (String sessionId : redis.getPlayersIds(gameId)) {
            try {
                Session session = players.get(sessionId);
                session.getBasicRemote().sendText(response);
            } catch (NullPointerException exp) {
                Logger.getLogger(GameApi.class.getCanonicalName())
                        .log(Level.WARNING, "A websocket was not found: {0}", sessionId);
                removeSessionId(sessionId);
            }
        }
    }

    protected void removeSessionId(String sessionId) {
        players.remove(sessionId);
        redis.removeSessionId(gameId, sessionId);
    }

}
