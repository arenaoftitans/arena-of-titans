package com.derniereligne.rest.servlets;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.movements.MovementsCard;
import com.derniereligne.engine.cards.movements.KnightMovementsCard;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Set;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 * <b>Rest servlet that returns the squares we can play.<b/>
 *
 * Expect parameters: x, y, card, color.
 * @author jenselme
 */
@Path("/play")
public class Play {
    @Context
    ServletContext context;

    /*@GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response sayHtmlHello(@QueryParam("card") String card,
            @QueryParam("color") String color,
            @QueryParam("x") int x, @QueryParam("y") int y) {

        // Create the board and move to the square
        Board board = new Board();
        Square currentSquare = board.getSquare(x, y);
        currentSquare.setAsOccupied();
        MovementsCard playableCard = getCard(board, card, color);

        // Get the possible squares.
        Set<Square> possibleSquares = playableCard.getPossibleMovements(currentSquare);

        // Get the JSON list of ids.
        Gson gson = new Gson();
        ArrayList<String> possibleSquaresIds = new ArrayList<>();
        for (Square square: possibleSquares) {
            possibleSquaresIds.add(square.getCssId());
        }
        String output = gson.toJson(possibleSquaresIds);

        return Response.status(Status.OK).entity(output).build();
    }

    /**
     * <b>Returns the card object that the player selected.</b>
     * <div>
     *  The card returned will be a card of the type given in the parameter cardType
     * and with the color given in the parameter color. For exemple, calling getCard(board,"warrior","red")
     * will return a red warrior.<br/>The default card returned is a yellow warrior.
     * </div>
     *
     * @param board
     *          Board where this card can be played.
     * @param cardType
     *          Type of card to get.
     * @param color
     *          Color of card to get.
     *
     * @return MovementsCard
          A card on the given board with the given type of the given color.
     *
     * @see Board
     * @see Color
     * @see BishopCard#BishopCard(com.derniereligne.engine.board.Board, com.derniereligne.engine.Color)
     * @see KingCard#KingCard(com.derniereligne.engine.board.Board, com.derniereligne.engine.Color)
     * @see QueenCard#QueenCard(com.derniereligne.engine.board.Board, com.derniereligne.engine.Color)
     * @see RiderCard#RiderCard(com.derniereligne.engine.board.Board, com.derniereligne.engine.Color)
     * @see WarriorCard#WarriorCard(com.derniereligne.engine.board.Board, com.derniereligne.engine.Color)
     * @see WizardCard#WizardCard(com.derniereligne.engine.board.Board, com.derniereligne.engine.Color)
     *
     * @since 1.0
     */
    /*private MovementsCard getCard(Board board, String cardType, String color) {
        Color cardColor;
        switch (color) {
            case "yellow":
                cardColor = Color.YELLOW;
                break;
            case "black":
                cardColor = Color.BLACK;
                break;
            case "blue":
                cardColor = Color.BLUE;
                break;
            case "red":
                cardColor = Color.RED;
                break;
            default:
                cardColor = Color.YELLOW;
        }

        switch (cardType) {
            case "warrior":
                return new WarriorCard(board, cardColor);
            case "wizard":
                return new WizardCard(board, cardColor);
            case "rider":
                return new KnightMovementsCard(board, cardColor);
            case "bishop":
                return new BishopCard(board, cardColor);
            case "queen":
                return new QueenCard(board, cardColor);
            case "king":
                return new KingCard(board, cardColor);
            default:
                return new WarriorCard(board, cardColor);
        }
    }*/
}
