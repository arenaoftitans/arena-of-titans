package com.derniereligne.rest.servlets;

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
    public Response play(@QueryParam(CARD_NAME) String cardName,
            @QueryParam(CARD_COLOR) String cardColor,
            @QueryParam(PLAYER_ID) String playerId,
            @QueryParam(X_COORD) String x,
            @QueryParam(Y_COORD) String y) {
        parameters.put(CARD_NAME, cardName);
        parameters.put(CARD_COLOR, cardColor);
        parameters.put(PLAYER_ID, playerId);
        parameters.put(X_COORD, x);
        parameters.put(Y_COORD, y);
        return getGameFactoryResponse();
    }

    @Override
    protected Response checkParametersAndGetResponse() {
        if (incorrectInputParemeters()) {
            String message = String
                    .format("Wrong input parameters. CardName: %s. CardColor: %s. PlayerId: %s. X: %s. Y: %s.",
                            parameters.get(CARD_NAME),
                            parameters.get(CARD_COLOR),
                            parameters.get(PLAYER_ID),
                            parameters.get(X_COORD),
                            parameters.get(Y_COORD));
            return buildBadResponse(message);
        }

        return getResponse();
    }

    /**
     * Return true if the input parameters are incorrect.
     *
     * @return true or false.
     */
    protected boolean incorrectInputParemeters() {
        return areInputParemetersIncorrect() || incorrectCoordinates();
    }

    /**
     * Return true if one of the coordinates passed as parameters is null.
     *
     * @return true or false.
     */
    protected boolean incorrectCoordinates() {
        return parameters.get(X_COORD) == null || parameters.get(Y_COORD) == null;
    }

    @Override
    protected Response getJsonResponse(ArrayList<String> possibleSquaresIds) {
        String x = parameters.get(X_COORD);
        String y = parameters.get(Y_COORD);
        String selectedSquareId = String.format("#%s-%s", x, y);
        if (!possibleSquaresIds.contains(selectedSquareId)) {
            String message = "Invalid square.";
            return buildBadResponse(message);
        }

        int targetedX = Integer.parseInt(x);
        int targetedY = Integer.parseInt(y);
        match.playTurn(targetedX, targetedY);
        Gson gson = new Gson();
        String[] selectedSquare = {selectedSquareId};
        String output = gson.toJson(selectedSquare);

        return Response.status(Response.Status.OK).entity(output).build();
    }

}
