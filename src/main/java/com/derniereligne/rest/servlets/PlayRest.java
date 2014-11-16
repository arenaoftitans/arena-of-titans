package com.derniereligne.rest.servlets;

import com.derniereligne.engine.Match;
import com.google.gson.Gson;
import java.util.ArrayList;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * <b>Rest servlet that returns the squares we can play.</b>
 *
 * Expect parameters: x, y, card, color.
 *
 * @author jenselme
 */
@Path("/play")
public class PlayRest extends PossibleSquaresLister {

    /**
     * x coordinate of the selected square.
     */
    private String x;
    /**
     * y coordinate of the selected square.
     */
    private String y;

    /**
     * The servlet GET method.
     *
     * @param cardName The name of the card the player wish to play.
     *
     * @param cardColor The color of the card the player wish to play.
     *
     * @param playerId The id of the player.
     *
     * @param x x coordinate of the selected square.
     *
     * @param y y coordinate of the selected square.
     *
     * @return A BAD_REQUEST or the JSON answer if everything worked correctly.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response play(@QueryParam("card_name") String cardName,
            @QueryParam("card_color") String cardColor,
            @QueryParam("player_id") String playerId,
            @QueryParam("x") String x,
            @QueryParam("y") String y) {
        match = (Match) req.getSession().getAttribute("match");
        if (match == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"No match is running\"}")
                    .build();
        }

        if (incorrectInputParemeters(cardName, cardColor, playerId, x, y)) {
            String message = String
                    .format("Wrong input parameters. Cardrname: %s. CardColor: %s. PlayerId: %s. X: %s. Y: %s.",
                            cardName, cardColor, playerId, x, y);
            return buildBadResponse(message);
        }

        init(x, y);

        return getResponse(cardName, cardColor);
    }

    protected boolean incorrectInputParemeters(String cardName, String cardColor, String playerId, String x, String y) {
        return areInputParemetersIncorrect(cardName, cardColor, playerId) || incorrectCoordinates(x, y);
    }

    protected boolean incorrectCoordinates(String x, String y) {
        return x == null || y == null;
    }

    protected void init(String x, String y) {
        init();
        this.x = x;
        this.y = y;
    }

    /**
     *
     * @param possibleSquaresIds
     * @return
     */
    @Override
    protected Response getJsonResponse(ArrayList<String> possibleSquaresIds) {
        String selectedSquareId = String.format("#%s-%s", x, y);
        if (!possibleSquaresIds.contains(selectedSquareId)) {
            String message = "Invalid square.";
            return buildBadResponse(message);
        }

        int targetedX = Integer.parseInt(x);
        int targetedY = Integer.parseInt(y);
        match.playTurn(targetedX, targetedY);
        Gson gson = new Gson();
        String output = gson.toJson(selectedSquareId);

        return Response.status(Response.Status.OK).entity(output).build();
    }

}
