package com.derniereligne.rest.servlets;

import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.Match;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/createGame")
public class CreateGameRest {

    private static final Response BAD_REQUEST = Response.status(Response.Status.BAD_REQUEST).build();
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
                    .entity("{\"error\": \"Not enough players. 2 Players at least are required to start a game\"}")
                    .build();
        }

        GameFactory gameFactory = new GameFactory();
        Match match = gameFactory.getMatch(players);
        req.getSession().setAttribute("match", match);

        String output = gson.toJson(players);
        return Response.status(Response.Status.OK).entity(output).build();
    }

    /**
     * Remove all players whose name is an empty string to the list of players.
     */
    private void removeEmptyPlayers() {
        List<JsonPlayer> correctedListOfPlayers = new ArrayList<>();
        for (int i = 0; i < players.size(); i++) {
            JsonPlayer jsonPlayer = players.get(i);
            if (!jsonPlayer.getName().equals("")) {
                jsonPlayer.setIndex(correctedListOfPlayers.size());
                correctedListOfPlayers.add(jsonPlayer);
            }
        }

        players = correctedListOfPlayers;
    }

}
