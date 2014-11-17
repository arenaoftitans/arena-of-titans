package com.derniereligne.rest.servlets;

import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.Match;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.Deck;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.ArrayList;
import java.util.Set;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 * <b>Rest servlet that returns the squares we can play.</b>
 *
 * Expect parameters: x, y, card, color.
 *
 * @author jenselme
 */
public abstract class PossibleSquaresLister {

    protected static final Response.ResponseBuilder BAD_REQUEST_BUILDER = Response.status(Status.BAD_REQUEST);
    protected Match match;
    protected GameFactory gameFactory;
    protected Board board;
    protected Deck deck;

    @Context
    ServletContext context;
    @Context
    HttpServletRequest req;

    /**
     * Checks that the parameters are all their (ie not null).
     *
     * @param cardName The name of the card.
     *
     * @param cardColor The color of the card.
     *
     * @param playerId The id of the player.
     *
     * @return True if all the parameters are present.
     */
    protected boolean areInputParemetersIncorrect(String cardName, String cardColor, String playerId) {
        return cardName == null || cardColor == null || playerId == null
                || isPlayerIdIncorrect(playerId);
    }

    /**
     * Return true if it is playerId's turn.
     *
     * @param playerId
     *
     * @return true if it is playerId's turn, false otherwise.
     */
    protected boolean isPlayerIdIncorrect(String playerId) {
        String currentPlayerId = Integer.toString(match.getActivePlayerIndex());
        return !playerId.equals(currentPlayerId);
    }

    /**
     * Init the object's attributes.
     */
    protected void init() {
        gameFactory = new GameFactory();
        board = gameFactory.getBoard();
        deck = gameFactory.getDeck();
    }

    /**
     * Return the proper answer to the request, ie the JSON answer or a BAD_REQUEST.
     *
     * @param cardName The name of the card.
     *
     * @param cardColor The color of the card.
     *
     * @return A JSON or BAD_REQUEST.
     */
    protected Response getResponse(String cardName, String cardColor) {
        Square currentSquare = match.getActivePlayerCurrentSquare();
        if (currentSquare == null) {
            String message = "Cannot get active player's current square.";
            return buildBadResponse(message);
        }
        currentSquare.setAsOccupied();

        // Get the card.
        MovementsCard playableCard = deck.getCard(cardName, cardColor);
        if (playableCard == null) {
            String message = String.format("Cannot get the selected card: %s, %s.", cardName, cardColor);
            return buildBadResponse(message);
        }

        ArrayList<String> possibleSquaresIds = getPossibleSquaresIds(playableCard, currentSquare);

        return getJsonResponse(possibleSquaresIds);
    }

    /**
     * Returns the list of the ids of the possible squares.
     *
     * @param playableCard The card the player wants to play.
     *
     * @param currentSquare The current square of the player.
     *
     * @return Returns the list of the ids of the possible squares.
     */
    protected ArrayList<String> getPossibleSquaresIds(MovementsCard playableCard, Square currentSquare) {
        Set<Square> possibleSquares = playableCard.getPossibleMovements(currentSquare);
        ArrayList<String> possibleSquaresIds = new ArrayList<>();
        for (Square square : possibleSquares) {
            possibleSquaresIds.add(square.getCssId());
        }

        return possibleSquaresIds;
    }

    protected Response buildBadResponse(String message) {
        return BAD_REQUEST_BUILDER.entity("{\"error\": \"" + message + "\"}").build();
    }

    protected abstract Response getJsonResponse(ArrayList<String> possibleSquaresIds);

}
