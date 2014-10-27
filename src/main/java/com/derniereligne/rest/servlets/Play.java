package com.derniereligne.rest.servlets;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.BishopCard;
import com.derniereligne.engine.cards.Card;
import com.derniereligne.engine.cards.KingCard;
import com.derniereligne.engine.cards.QueenCard;
import com.derniereligne.engine.cards.RiderCard;
import com.derniereligne.engine.cards.WarriorCard;
import com.derniereligne.engine.cards.WizardCard;
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
 * Rest servlet that returns the squares we can play.
 *
 * Expect parameters: x, y, card, color.
 * @author jenselme
 */
@Path("/play")
public class Play {
    @Context
    ServletContext context;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response sayHtmlHello(@QueryParam("card") String card,
            @QueryParam("color") String color,
            @QueryParam("x") int x, @QueryParam("y") int y) {

        // Create the board and move to the square
        Board board = new Board();
        Square currentSquare = board.getSquare(x, y);
        currentSquare.setAsOccupied();
        Card playableCard = getCard(board, card, color);

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
     * Returns the card object that the player selected.
     * @param board
     * @param name
     * @param color
     * @return Card
     */
    private Card getCard(Board board, String name, String color) {
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

        switch (name) {
            case "warrior":
                return new WarriorCard(board, cardColor);
            case "wizard":
                return new WizardCard(board, cardColor);
            case "rider":
                return new RiderCard(board, cardColor);
            case "bishop":
                return new BishopCard(board, cardColor);
            case "queen":
                return new QueenCard(board, cardColor);
            case "king":
                return new KingCard(board, cardColor);
            default:
                return new WarriorCard(board, cardColor);
        }
    }
}
