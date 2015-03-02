package com.aot.engine.api.json;

import com.aot.engine.Match;
import com.google.gson.Gson;

public class CardPlayedJsonResponseBuilder {

    private CardPlayedJsonResponseBuilder() {
    }

    /**
     * Create the proper JSON response containing the information on the next player.
     *
     * @param match The current match.
     * @return The response containing the JSON defined in the wiki.
     */
    public static String build(Match match) {
        CardPlayedJsonResponse cardPlayedJsonResponse = createCardPlayedJsonRespones(match);

        String output = createOutputJson(cardPlayedJsonResponse);

        return output;
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
        cardPlayedJsonResponse.setPlayers(match.getPlayersForJsonExport());
        cardPlayedJsonResponse.setNexPlayerId(Integer.toString(match.getActivePlayerIndex()));
        cardPlayedJsonResponse.setNextPlayerIndex(match.getActivePlayerIndex());
        cardPlayedJsonResponse.setNextPlayerName(match.getActivePlayerName());
        cardPlayedJsonResponse.setPossibleCardsNextPlayer(match.getActivePlayerHandForJsonExport());
        cardPlayedJsonResponse.setTrumpsNextPlayer(match.getActivePlayerTrumpsForJsonExport());
        cardPlayedJsonResponse.setTrumps(match.getActiveTrumpsForJsonExport());
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
     * @param targetedX
     * @param targetedY
     *
     * @return The response containing the JSON defined in the wiki.
     */
    public static String build(Match match, int targetedX, int targetedY) {
        CardPlayedJsonResponse nextPlayer = createCardPlayedJsonRespones(match);
        nextPlayer.setNewSquare(targetedX, targetedY);

        String output = createOutputJson(nextPlayer);

        return output;
    }

}
