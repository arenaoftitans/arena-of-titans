package com.aot.engine.api;

import com.aot.engine.board.Square;
import java.util.ArrayList;
import java.util.List;

public abstract class PossibleSquaresLister extends GameApi {

    /**
     * Static attribute used to create response with status code 400.
     */
    protected static final String CARD_NAME = "card_name";
    protected static final String CARD_COLOR = "card_color";
    protected static final String PLAYER_ID = "player_id";
    protected static final String X_COORD = "x";
    protected static final String Y_COORD = "y";
    protected static final String PASS = "pass";
    protected static final String DISCARD_SELECTED_CARD = "discard";

    /**
     * Checks that the parameters are all their (ie not null).
     *
     * @return True if all the parameters are present.
     */
    protected boolean areInputParemetersIncorrect() {
        return parameters.get(CARD_NAME) == null
                || parameters.get(CARD_COLOR) == null
                || parameters.get(PLAYER_ID) == null
                || isPlayerIdIncorrect();
    }

    /**
     * Return true if it is playerId's turn.
     *
     * @return true if it is playerId's turn, false otherwise.
     */
    protected boolean isPlayerIdIncorrect() {
        String currentPlayerId = Integer.toString(match.getActivePlayerIndex());
        return !parameters.get(PLAYER_ID).equals(currentPlayerId);
    }

    @Override
    protected String getResponse() {
        String cardName = parameters.get(CARD_NAME);
        String cardColor = parameters.get(CARD_COLOR);
        Square currentSquare = match.getActivePlayerCurrentSquare();
        if (currentSquare == null) {
            String message = "Cannot get active player's current square.";
            return buildBadResponse(message);
        }
        currentSquare.setAsOccupied();

        // Get the card.
        playableCard = currentPlayerDeck.getCard(cardName, cardColor);
        if (playableCard == null) {
            String message = String.format("Cannot get the selected card: %s, %s.", cardName, cardColor);
            return buildBadResponse(message);
        }

        List<String> possibleSquaresIds = new ArrayList<>(playableCard.getPossibleMovements(currentSquare));

        return getJsonResponse(possibleSquaresIds);
    }

    /**
     * Format the JSON response from the list of all possible squares.
     *
     * @param possibleSquaresIds
     * @return A response object.
     */
    protected abstract String getJsonResponse(List<String> possibleSquaresIds);

}
