package com.aot.engine.api;

import com.aot.engine.Match;
import java.util.Set;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class Redis {

    public static final String GAME_KEY_PART = "game:";
    public static final String MATCH_KEY = "match";
    public static final String GAME_MASTER_KEY = "game_master";
    public static final String SESSIONS_KEY_PART = "sessions:";
    // time in seconds after which the game is deleted (48h).
    public static final int GAME_EXPIRE = 172_800;
    public static final String SERVER_HOST = "localhost";
    public static final String REDIS_SERVLET = "redis";

    private final JedisPool jedisPool;

    private Redis(JedisPool jp) {
        jedisPool = jp;
    }

    public static Redis getInstance() {
        JedisPool jp = new JedisPool(new JedisPoolConfig(), SERVER_HOST);
        return new Redis(jp);
    }

    public Match getMatch(String id) {
        try (Jedis jedis = jedisPool.getResource()) {
            String matchJson = jedis.hget(GAME_KEY_PART + id, MATCH_KEY);
            return Match.fromJson(matchJson);
        }
    }

    public void saveMatch(Match match) {
        try (Jedis jedis = jedisPool.getResource()) {
            String matchJson = match.toJson();
            String gameId = match.getId();
            jedis.hset(GAME_KEY_PART + gameId,
                    MATCH_KEY, matchJson);
            jedis.expire(GAME_KEY_PART + gameId, GAME_EXPIRE);
        }
    }

    public Set<String> getSessionsIds(String gameId) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.smembers(SESSIONS_KEY_PART + gameId);
        }
    }

    public void saveSessionId(String gameId, String sessionId) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.sadd(SESSIONS_KEY_PART + gameId, sessionId);
            jedis.expire(SESSIONS_KEY_PART + gameId, GAME_EXPIRE);
        }
    }

    public void removeSessionId(String gameId, String sessionId) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.srem(SESSIONS_KEY_PART + gameId, sessionId);
        }
    }

    /**
     * Must be called only at server shutdown in InitializeRedis.
     */
    public void destroy() {
        jedisPool.destroy();
    }

    public boolean doesGameExists(String gameId) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.hget(GAME_KEY_PART + gameId, GAME_MASTER_KEY) != null;
        }
    }

}
