package com.derniereligne.rest.servlets;

import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.Match;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.Deck;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
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

    /**
     * Static attribute used to create response with status code 400.
     */
    protected static final Response.ResponseBuilder BAD_REQUEST_BUILDER = Response.status(Status.BAD_REQUEST);
    protected static final String CARD_NAME = "card_name";
    protected static final String CARD_COLOR = "card_color";
    protected static final String PLAYER_ID = "player_id";
    protected static final String X_COORD = "x";
    protected static final String Y_COORD = "y";


    /**
     * The map of all parameters passed in the URL.
     */
    protected Map<String, String> parameters;
    /**
     * The GameFactory of the current game.
     */
    protected GameFactory gameFactory;
    /**
     * The Match the user is playing.
     */
    protected Match match;
    /**
     * The Board he is playing on.
     */
    protected Board board;
    /**
     * His deck of cards.
     */
    protected Deck deck;

    /**
     * The request done to the servlet.
     */
    @Context
    HttpServletRequest request;

    public PossibleSquaresLister() {
        parameters = new HashMap<>();
    }

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

    /**
     * Init the object's attributes.
     */
    protected void init() {
        match = gameFactory.getMatch();
        board = gameFactory.getBoard();
        deck = gameFactory.getDeck();
    }

    /**
     * Return the proper answer to the request, ie the JSON answer or a BAD_REQUEST.
     *
     * @return A JSON or BAD_REQUEST.
     */
    protected Response getResponse() {
        String cardName = parameters.get(CARD_NAME);
        String cardColor = parameters.get(CARD_COLOR);
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

    /**
     * Create the bad Response object based on a message.
     * @param message The message to send to the client.
     * @return A JSON object containing the error message.
     */
    protected Response buildBadResponse(String message) {
        return BAD_REQUEST_BUILDER.entity("{\"error\": \"" + message + "\"}").build();
    }

    /**
     * Get the GameFactory from the session and then continue with parameters check.
     * @return
     */
    protected Response getGameFactoryResponse() {
        gameFactory = (GameFactory) request.getSession().getAttribute("gameFactory");
        if (gameFactory == null) {
            return buildBadResponse("No match is running");
        }

        init();
        return checkParametersAndGetResponse();
    }

    /**
     * Check that the passed parameters are consistent and returns a Response (400 if there is a
     * problem) or goes on.
     *
     * @return A Response object.
     */
    protected abstract Response checkParametersAndGetResponse();

    /**
     * Format the JSON response from the list of all possible squares.
     *
     * @param possibleSquaresIds
     * @return A response object.
     */
    protected abstract Response getJsonResponse(ArrayList<String> possibleSquaresIds);

}
