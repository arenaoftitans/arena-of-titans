package com.aot.http.rest;

import com.google.gson.Gson;
import java.util.Collections;
import java.util.List;
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
    public Response getPossibleSquares(@QueryParam(CARD_NAME) String cardName,
            @QueryParam(CARD_COLOR) String cardColor,
            @QueryParam(PLAYER_ID) String playerId) {
        parameters.put(CARD_NAME, cardName);
        parameters.put(CARD_COLOR, cardColor);
        parameters.put(PLAYER_ID, playerId);
        return getGameFactoryResponse();
    }

    @Override
    protected Response checkParametersAndGetResponse() {
        if (areInputParemetersIncorrect()) {
            String message = String
                    .format("Wrong input parameters. CardName: %s. CardColor: %s. PlayerId: %s.",
                            parameters.get(CARD_NAME),
                            parameters.get(CARD_COLOR),
                            parameters.get(PLAYER_ID));
            return buildBadResponse(message);
        }

        return getResponse();
    }

    @Override
    protected Response getJsonResponse(List<String> possibleSquaresIds) {
        Gson gson = new Gson();
        Collections.sort(possibleSquaresIds);
        String output = gson.toJson(possibleSquaresIds);

        return Response.status(Status.OK).entity(output).build();
    }

}
