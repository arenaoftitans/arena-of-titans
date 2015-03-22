package com.aot.http.rest;

import com.aot.engine.api.json.JsonPlayer;
import com.aot.engine.api.json.PlayJsonResponseBuilder;
import com.aot.engine.GameFactory;
import com.aot.engine.api.GameApiOld;
import com.aot.engine.api.Redis;
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

@Path("/createGame")
public class CreateGameRest extends GameApiOld {

    private static final int MAXIMUM_NUMBER_OF_PLAYERS = 8;
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
        } else if (players.size() > MAXIMUM_NUMBER_OF_PLAYERS) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error_to_display\": \"To many players. 8 Players max.\"}")
                    .build();
        }

        GameFactory gameFactory = new GameFactory();
        gameFactory.createNewMatch(players);
        match = gameFactory.getMatch();

        Redis redis = (Redis) context.getAttribute(Redis.REDIS_SERVLET);
        redis.saveMatch(match);

        return Response.status(Response.Status.OK).entity("{\"game_id\": \"1\"}").build();
    }

    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGame() {
        retrieveMatch();

        return Response.status(Response.Status.OK)
                .entity(PlayJsonResponseBuilder.build(match))
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

    @Override
    protected String getResponse() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    protected String checkParametersAndGetResponse() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}
