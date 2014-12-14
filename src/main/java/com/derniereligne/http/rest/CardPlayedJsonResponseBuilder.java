package com.derniereligne.http.rest;

import com.derniereligne.engine.Match;
import com.google.gson.Gson;
import javax.ws.rs.core.Response;

public class CardPlayedJsonResponseBuilder {

    private CardPlayedJsonResponseBuilder() {
    }

    /**
     * Create the proper JSON response containing the information on the next player.
     *
     * @param match The current match.
     * @return The response containing the JSON defined in the wiki.
     */
    public static Response build(Match match) {
        CardPlayedJsonResponse cardPlayedJsonResponse = createCardPlayedJsonRespones(match);

        String output = createOutputJson(cardPlayedJsonResponse);

        return Response.status(Response.Status.OK).entity(output).build();
    }

    /**
     * Create the object containing the informations about the next player.
     *
     * @param match The current match.
     *
     * @return The nextPlayer object.
     */
    private static CardPlayedJsonResponse createCardPlayedJsonRespones(Match match) {
        CardPlayedJsonResponse cardPlayedJsonResponse = new CardPlayedJsonResponse();
        cardPlayedJsonResponse.init();
        cardPlayedJsonResponse.setNexPlayerId(Integer.toString(match.getActivePlayerIndex()));
        cardPlayedJsonResponse.setNextPlayerName(match.getActivePlayerName());
        cardPlayedJsonResponse.setPossibleCardsNextPlayer(match.getActivePlayerHandForJsonExport());
        cardPlayedJsonResponse.setTrumpsNextPlayer(match.getActivePlayerTrumpsForJsonExport());
        cardPlayedJsonResponse.setGameOver(match.getGameOver());
        cardPlayedJsonResponse.setWinners(match.getWinnerNames());

        return cardPlayedJsonResponse;
    }

    /**
     * Transform the nextPlayer object into JSON.
     *
     * @param nextPlayer The object to convert into JSON.
     *
     * @return The JSON.
     */
    private static String createOutputJson(CardPlayedJsonResponse cardPlayedJsonResponse) {
        Gson gson = new Gson();
        return gson.toJson(cardPlayedJsonResponse);
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
        CardPlayedJsonResponse nextPlayer = createCardPlayedJsonRespones(match);
        nextPlayer.setNewSquare(selectedSquareId);

        String output = createOutputJson(nextPlayer);

        return Response.status(Response.Status.OK).entity(output).build();
    }

}
