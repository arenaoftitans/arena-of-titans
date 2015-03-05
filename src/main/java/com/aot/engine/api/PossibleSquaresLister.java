package com.aot.engine.api;

import com.aot.engine.board.Square;
import java.util.ArrayList;
import java.util.List;

public abstract class PossibleSquaresLister extends GameApi {

    protected class WsMove {

        private String card_name;
        private String card_color;
        private String player_id;
        private Integer x;
        private Integer y;
        private boolean pass;
        private boolean discard;

        public String getCardName() {
            return card_name;
        }

        public String getCardColor() {
            return card_color;
        }

        public String getPlayerId() {
            return player_id;
        }

        public Integer getX() {
            return x;
        }

        public Integer getY() {
            return y;
        }

        public boolean isPass() {
            return pass;
        }

        public boolean isDiscard() {
            return discard;
        }

        @Override
        public String toString() {
            return "WsMove{" + "card_name=" + card_name + ", card_color=" + card_color + ", player_id=" + player_id + ", x=" + x + ", y=" + y + ", pass=" + pass + ", discard=" + discard + '}';
        }
    }

    protected WsMove wsMove;

    /**
     * Checks that the parameters are all their (ie not null).
     *
     * @return True if all the parameters are present.
     */
    protected boolean areInputParemetersIncorrect() {
        return wsMove.getCardName() == null
                || wsMove.getCardColor() == null
                || wsMove.getPlayerId() == null
                || isPlayerIdIncorrect();
    }

    /**
     * Return true if it is playerId's turn.
     *
     * @return true if it is playerId's turn, false otherwise.
     */
    protected boolean isPlayerIdIncorrect() {
        String currentPlayerId = Integer.toString(match.getActivePlayerIndex());
        return !wsMove.getPlayerId().equals(currentPlayerId);
    }

    @Override
    protected String getResponse() {
        String cardName = wsMove.getCardName();
        String cardColor = wsMove.getCardColor();
        Square currentSquare = match.getActivePlayerCurrentSquare();
        if (currentSquare == null) {
            String message = "Cannot get active player's current square.";
            return buildBadResponse(message);
        }
        currentSquare.setAsOccupied();

        // Get the card.
        playableCard = match.getActivePlayerDeck().getCard(cardName, cardColor);
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
