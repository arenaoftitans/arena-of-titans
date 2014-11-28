package com.derniereligne.http.rest;

import com.derniereligne.engine.Match;
import com.google.gson.Gson;
import javax.ws.rs.core.Response;

public class NextPlayerJsonBuilder {

    /**
     * Create the proper JSON response containing the information on the next player.
     *
     * @param match The current match.
     * @return The response containing the JSON defined in the wiki.
     */
    public static Response build(Match match) {
        NextPlayer nextPlayer = createNextPlayer(match);

        String output = createOutputJson(nextPlayer);

        return Response.status(Response.Status.OK).entity(output).build();
    }

    /**
     * Create the object containing the informations about the next player.
     *
     * @param match The current match.
     *
     * @return The nextPlayer object.
     */
    private static NextPlayer createNextPlayer(Match match) {
        NextPlayer nextPlayer = new NextPlayer();
        nextPlayer.init();
        nextPlayer.setNexPlayerId(Integer.toString(match.getActivePlayerIndex()));
        nextPlayer.setNextPlayerName(match.getActivePlayerName());
        nextPlayer.setPossibleCardsNextPlayer(match.getActivePlayerHandForJsonExport());

        return nextPlayer;
    }

    /**
     * Transform the nextPlayer object into JSON.
     *
     * @param nextPlayer The object to convert into JSON.
     *
     * @return The JSON.
     */
    private static String createOutputJson(NextPlayer nextPlayer) {
        Gson gson = new Gson();
        return gson.toJson(nextPlayer);
    }

    /**
     * Create the proper JSON response containing the information on the next player.
     *
     * @param match The current match.
     * @param selectedSquareId The square on which the player wants to go.
     *
     * @return The response containing the JSON defined in the wiki.
     */
    public static Response build(Match match, String selectedSquareId) {
        NextPlayer nextPlayer = createNextPlayer(match);
        nextPlayer.setNewSquare(selectedSquareId);

        String output = createOutputJson(nextPlayer);

        return Response.status(Response.Status.OK).entity(output).build();
    }

}
