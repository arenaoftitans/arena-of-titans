package com.aot.engine.api;

import com.aot.engine.Match;
import com.aot.engine.api.json.GameApiJson;
import java.util.Set;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class Redis {

    public static final String GAME_KEY_PART = "game:";
    public static final String MATCH_KEY = "match";
    public static final String GAME_MASTER_KEY = "game_master";
    public static final String STARTED_KEY = "started";
    public static final String GAME_STARTED = "true";
    public static final String GAME_NOT_STARTED = "false";
    public static final String PLAYERS_KEY_PART = "players:";
    public static final String SLOTS_KEY_PART = "slots:";
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
        }
    }

    public Set<String> getPlayersIds(String gameId) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.smembers(PLAYERS_KEY_PART + gameId);
        }
    }

    public void initializeDatabase(String gameId, String sessionId) {
        try (Jedis jedis = jedisPool.getResource()) {
            // Set game creator as game master
            jedis.hset(GAME_KEY_PART + gameId, GAME_MASTER_KEY, sessionId);

            jedis.sadd(PLAYERS_KEY_PART + gameId, sessionId);

            jedis.hset(GAME_KEY_PART + gameId, STARTED_KEY, GAME_NOT_STARTED);

            jedis.lpush(SLOTS_KEY_PART + gameId, "");

            jedis.expire(PLAYERS_KEY_PART + gameId, GAME_EXPIRE);
            jedis.expire(GAME_KEY_PART + gameId, GAME_EXPIRE);
            jedis.expire(SLOTS_KEY_PART + gameId, GAME_EXPIRE);
        }
    }

    public void saveSessionId(String gameId, String sessionId) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.sadd(PLAYERS_KEY_PART + gameId, sessionId);
        }
    }

    public void removeSessionId(String gameId, String sessionId) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.srem(PLAYERS_KEY_PART + gameId, sessionId);
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

    public void updateSlot(String gameId, GameApiJson.UpdatedSlot updatedSlot) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.lset(SLOTS_KEY_PART + gameId, updatedSlot.getIndex(), updatedSlot.toJson());
        }
    }

    public void addSlot(String gameId, GameApiJson.UpdatedSlot updatedSlot) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.rpush(SLOTS_KEY_PART + gameId, updatedSlot.toJson());
        }
    }

    public boolean hasGameStarted(String gameId) {
        try (Jedis jedis = jedisPool.getResource()) {
            String gameStarted  = jedis.hget(GAME_KEY_PART + gameId, STARTED_KEY);
            return "true".equals(gameStarted);
        }
    }

    boolean isGameMaster(String gameId, String playerId) {
        try (Jedis jedis = jedisPool.getResource()) {
            return playerId.equals(jedis.hget(GAME_KEY_PART + gameId, GAME_MASTER_KEY));
        }
    }

}
