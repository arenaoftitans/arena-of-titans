package com.aot.engine.api;

import com.aot.engine.Match;
import com.aot.engine.board.Board;
import com.aot.engine.cards.movements.MovementsCard;
import javax.servlet.http.HttpSession;
import javax.websocket.EndpointConfig;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public abstract class GameApi {

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
    protected Session wsSession;
    protected HttpSession httpSession;
    protected String gameId;

    /**
     * Return the proper answer to the request, ie the JSON answer or a BAD_REQUEST.
     *
     * @return A JSON or BAD_REQUEST.
     */
    protected abstract String getResponse();

    /**
     * Create the bad Response object based on a message.
     *
     * @param message The message to send to the client.
     * @return A JSON object containing the error message.
     */
    protected String buildBadResponse(String message) {
        return "{\"error\": \"" + message + "\"}";
    }

    /**
     * Get the GameFactory from the session and then continue with parameters check.
     *
     * @return
     */
    protected String getGameFactoryResponse() {
        JedisPool pool = new JedisPool(new JedisPoolConfig(), Redis.SERVER_HOST);

        try (Jedis jedis = pool.getResource()) {
            String matchJson = jedis.hget(Redis.GAME_KEY_PART + gameId,
                    Redis.MATCH_KEY);
            match = Match.fromJson(matchJson);
        }

        if (match == null) {
            return buildBadResponse("No match is running");
        }

        pool.destroy();
        return checkParametersAndGetResponse();
    }

    protected abstract String checkParametersAndGetResponse();

    @OnOpen
    public void open(Session session, EndpointConfig config) {
        this.wsSession = session;
        this.httpSession = (HttpSession) config.getUserProperties()
                .get(HttpSession.class.getName());
    }

    protected void saveMatch() {
        JedisPool pool = new JedisPool(new JedisPoolConfig(), Redis.SERVER_HOST);
        try (Jedis jedis = pool.getResource()) {
            String matchJson = match.toJson();
            jedis.hset(Redis.GAME_KEY_PART + 1,
                    Redis.MATCH_KEY, matchJson);
            jedis.expire(Redis.GAME_KEY_PART + 1, Redis.GAME_EXPIRE);
        }
        pool.destroy();
    }

    protected Match retrieveMatch() {
        JedisPool pool = new JedisPool(new JedisPoolConfig(), "localhost");
        try (Jedis jedis = pool.getResource()) {
            String matchJson = jedis.hget(Redis.GAME_KEY_PART + 1, Redis.MATCH_KEY);
            match = Match.fromJson(matchJson);
        }
        pool.destroy();

        return match;
    }

}
