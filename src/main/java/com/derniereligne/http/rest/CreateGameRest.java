package com.derniereligne.http.rest;

import com.derniereligne.engine.GameFactory;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/createGame")
public class CreateGameRest {

    private List<JsonPlayer> players;

    @Context
    ServletContext context;
    @Context
    HttpServletRequest req;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
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
        req.getSession().setAttribute("gameFactory", gameFactory);

        String output = gson.toJson(players);
        return Response.status(Response.Status.OK).entity(output).build();
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
