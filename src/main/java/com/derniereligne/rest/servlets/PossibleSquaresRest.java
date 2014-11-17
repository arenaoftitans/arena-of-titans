package com.derniereligne.rest.servlets;

import com.derniereligne.engine.Match;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Collections;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
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
public class PossibleSquaresRest extends PossibleSquaresLister {

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
        match = (Match) req.getSession().getAttribute("match");
        if (match == null) {
            return buildBadResponse("No match is running");
        }

        if (areInputParemetersIncorrect(cardName, cardColor, playerId)) {
            String message = String
                    .format("Wrong input parameters. CardName: %s. CardColor: %s. PlayerId: %s.",
                            cardName, cardColor, playerId);
            return buildBadResponse(message);
        }

        init();

        return getResponse(cardName, cardColor);
    }

    /**
     *
     * @param possibleSquaresIds
     * @return
     */
    @Override
    protected Response getJsonResponse(ArrayList<String> possibleSquaresIds) {
        Gson gson = new Gson();
        Collections.sort(possibleSquaresIds);
        String output = gson.toJson(possibleSquaresIds);

        return Response.status(Status.OK).entity(output).build();
    }

}
