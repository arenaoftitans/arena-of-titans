package com.aot.engine.api;

import com.aot.engine.Match;
import com.aot.engine.api.json.GameApiJson.UpdatedSlot;
import com.aot.engine.lobby.SlotState;
import com.google.gson.Gson;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class Redis {

    public static final String BOARD_KEY_PART = "board:";
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

    public void saveMatch(Match match, String gameId) {
        try (Jedis jedis = jedisPool.getResource()) {
            String matchJson = match.toJson();
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

    public void updateSlot(String gameId, UpdatedSlot updatedSlot) {
        try (Jedis jedis = jedisPool.getResource()) {
            int index = updatedSlot.getIndex();
            // Update the slot unless it is taken.
            Gson gson = new Gson();
            UpdatedSlot currentSlot = gson.fromJson(jedis.lindex(SLOTS_KEY_PART + gameId, index),
                    UpdatedSlot.class);
            if (currentSlot.getState() != SlotState.TAKEN) {
                jedis.lset(SLOTS_KEY_PART + gameId, index, updatedSlot.toJson());
            }
        }
    }

    public void addSlot(String gameId, UpdatedSlot updatedSlot) {
        try (Jedis jedis = jedisPool.getResource()) {
            if (updatedSlot.getIndex() == 0) {
                jedis.lset(SLOTS_KEY_PART + gameId, 0, updatedSlot.toJson());
            } else {
                jedis.rpush(SLOTS_KEY_PART + gameId, updatedSlot.toJson());
            }
        }
    }

    public boolean hasGameStarted(String gameId) {
        try (Jedis jedis = jedisPool.getResource()) {
            String gameStarted = jedis.hget(GAME_KEY_PART + gameId, STARTED_KEY);

            return GAME_STARTED.equals(gameStarted);
        }
    }

    boolean isGameMaster(String gameId, String playerId) {
        try (Jedis jedis = jedisPool.getResource()) {
            return playerId.equals(jedis.hget(GAME_KEY_PART + gameId, GAME_MASTER_KEY));
        }
    }

    public String getBoard(String boardName) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.get(BOARD_KEY_PART + boardName);
        }
    }

    public void saveBoard(String boardName, String board) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.set(BOARD_KEY_PART + boardName, board);
        }
    }

    public void gameHasStarted(String gameId) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.hset(GAME_KEY_PART + gameId, STARTED_KEY, GAME_STARTED);
        }
    }

    public boolean hasOpenedSlot(String gameId) {
        try (Jedis jedis = jedisPool.getResource()) {
            Gson gson = new Gson();
            return !jedis.lrange(SLOTS_KEY_PART + gameId, 0, -1)
                    .stream()
                    .map(updatedSlotJson -> gson.fromJson(updatedSlotJson, UpdatedSlot.class))
                    .filter(slot -> slot.getState() == SlotState.OPEN)
                    .collect(Collectors.toList())
                    .isEmpty();
        }
    }

    List<UpdatedSlot> getSlots(String gameId) {
        try (Jedis jedis = jedisPool.getResource()) {
            Gson gson = new Gson();
            return jedis.lrange(SLOTS_KEY_PART + gameId, 0, -1)
                    .stream()
                    .map(updateSlotJson -> gson.fromJson(updateSlotJson, UpdatedSlot.class))
                    .collect(Collectors.toList());
        }
    }

}
