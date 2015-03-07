package com.aot.http.rest;

import com.aot.engine.api.json.JsonPlayer;
import com.aot.engine.api.json.CardPlayedJsonResponseBuilder;
import com.aot.engine.GameFactory;
import com.aot.engine.Match;
import com.aot.engine.api.Redis;
import com.aot.engine.trumps.RemovingColorTrump;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@Path("/createGame")
public class CreateGameRest {

    private List<JsonPlayer> players;

    @Context
    ServletContext context;
    @Context
    HttpServletRequest req;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createGame(String jsonStringPlayers) {
        Gson gson = new Gson();
        players = Arrays.asList(gson.fromJson(jsonStringPlayers, JsonPlayer[].class));
        removeEmptyPlayers();

        if (players.size() < 2) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error_to_display\": \"Not enough players. 2 Players at least are required to start a game\"}")
                    .build();
        }

        GameFactory gameFactory = new GameFactory();
        gameFactory.createNewMatch(players);
        Match match = gameFactory.getMatch();

        JedisPool pool = new JedisPool(new JedisPoolConfig(), Redis.SERVER_HOST);
        try (Jedis jedis = pool.getResource()) {
            String matchJson = match.toJson();
            jedis.hset(Redis.GAME_KEY_PART + 1,
                    Redis.MATCH_KEY, matchJson);
            jedis.expire(Redis.GAME_KEY_PART + 1, Redis.GAME_EXPIRE);
        }
        pool.destroy();

        return Response.status(Response.Status.OK).entity("{\"game_id\": \"1\"}").build();
    }

    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGame() {
        Match match = null;

        JedisPool pool = new JedisPool(new JedisPoolConfig(), "localhost");
        try (Jedis jedis = pool.getResource()) {
            String matchJson = jedis.hget(Redis.GAME_KEY_PART + 1, Redis.MATCH_KEY);
            match = Match.fromJson(matchJson);
        }
        pool.destroy();

        return Response.status(Response.Status.OK)
                .entity(CardPlayedJsonResponseBuilder.build(match))
                .build();
    }

    /**
     * Remove all players whose name is an empty string to the list of players.
     */
    private void removeEmptyPlayers() {
        List<JsonPlayer> correctedListOfPlayers = new ArrayList<>();
        for (JsonPlayer jsonPlayer : players) {
            if (!"".equals(jsonPlayer.getName())) {
                jsonPlayer.setIndex(correctedListOfPlayers.size());
                correctedListOfPlayers.add(jsonPlayer);
            }
        }

        players = correctedListOfPlayers;
    }

}
