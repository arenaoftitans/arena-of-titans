package com.aot.engine.api;

import com.aot.engine.Match;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class Redis {

    public static final String GAME_KEY_PART = "game:";
    public static final String MATCH_KEY = "match";
    // time in seconds after which the game is deleted (48h).
    public static final int GAME_EXPIRE = 172_800;
    public static final String SERVER_HOST = "localhost";
    public static final String REDIS_SERVLET = "redis";

    private final JedisPool jedisPool;

    private Redis(JedisPool jp) {
        jedisPool = jp;
    }

    public static Redis getInstance() {
        JedisPool jp = new JedisPool(new JedisPoolConfig(), Redis.SERVER_HOST);
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
                    Redis.MATCH_KEY, matchJson);
            jedis.expire(GAME_KEY_PART + gameId, Redis.GAME_EXPIRE);
        }
    }

    /**
     * Must be called only at server shutdown in InitializeRedis.
     */
    public void destroy() {
        jedisPool.destroy();
    }

}
