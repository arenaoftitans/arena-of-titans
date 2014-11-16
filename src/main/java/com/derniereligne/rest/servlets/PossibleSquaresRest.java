package com.derniereligne.rest.servlets;

import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.Deck;
import com.derniereligne.engine.cards.movements.MovementsCard;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Set;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 * <b>Rest servlet that returns the squares we can play.</b>
 *
 * Expect parameters: x, y, card, color.
 *
 * @author jenselme
 */
@Path("/getPossibleSquares")
public class PossibleSquaresRest {

    private static final Response BAD_REQUEST = Response.status(Status.BAD_REQUEST).build();
    private HttpSession session;
    private GameFactory gameFactory;
    private Board board;
    private Deck deck;

    @Context
    ServletContext context;

    /**
     * The servlet GET method.
     *
     * @param cardName The name of the card the player wish to play.
     *
     * @param cardColor The color of the card the player wish to play.
     *
     * @param playerId The id of the player.
     *
     * @return A BAD_REQUEST or the JSON answer if everything worked correctly.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPossibleSquares(@QueryParam("card_name") String cardName,
            @QueryParam("card_color") String cardColor,
            @QueryParam("player_id") String playerId) {
        if (incorrectInputParemeters(cardName, cardColor, playerId)) {
            return BAD_REQUEST;
        }

        init();

        return getResponse(cardName, cardColor, playerId);
    }

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
    private boolean incorrectInputParemeters(String cardName, String cardColor, String playerId) {
        return cardName == null || cardColor == null || playerId == null
                || !"0".equals(playerId);
    }

    /**
     * Init the object's attributes.
     */
    private void init() {
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
    private Response getResponse(String cardName, String cardColor, String playerId) {
        Square currentSquare = getCurrentSquare(playerId);
        if (currentSquare == null) {
            return BAD_REQUEST;
        }
        currentSquare.setAsOccupied();

        // Get the card.
        MovementsCard playableCard = deck.getCard(cardName, cardColor);
        if (playableCard == null) {
            return BAD_REQUEST;
        }

        ArrayList<String> possibleSquaresIds = getPossibleSquaresIds(playableCard, currentSquare);

        return getJsonResponse(possibleSquaresIds);
    }

    /**
     * Returns the currentSquare of the player or null if the square is not in the board or if it is
     * not this player's turn.
     *
     * @param playerId The id of the player.
     *
     * @return The current Square of the player or null.
     */
    private Square getCurrentSquare(String playerId) {
        return board.getSquare(0, 7);
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
    private ArrayList<String> getPossibleSquaresIds(MovementsCard playableCard, Square currentSquare) {
        Set<Square> possibleSquares = playableCard.getPossibleMovements(currentSquare);
        ArrayList<String> possibleSquaresIds = new ArrayList<>();
        for (Square square : possibleSquares) {
            possibleSquaresIds.add(square.getCssId());
        }

        return possibleSquaresIds;
    }

    /**
     *
     * @param possibleSquaresIds
     * @return
     */
    private Response getJsonResponse(ArrayList<String> possibleSquaresIds) {
        Gson gson = new Gson();
        Collections.sort(possibleSquaresIds);
        String output = gson.toJson(possibleSquaresIds);

        return Response.status(Status.OK).entity(output).build();
    }

}
