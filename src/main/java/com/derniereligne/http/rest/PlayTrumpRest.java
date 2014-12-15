
package com.derniereligne.http.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * <b>Rest servlet that plays a trump card.</b>
 *
 * Expect parameters: card_name.
 *
 * @author jenselme
 */
@Path("/playTrump")
public class PlayTrumpRest extends GameRest {

    private static final String TRUMP_NAME = "name";
    private static final String TARGETED_PLAYER_INDEX = "targetIndex";

    /**
     * The servlet GET method.
     *
     * @param trumpName The name of the card the player wish to play.
     * @param targetIndex The index of the targeted player.
     *
     * @return A BAD_REQUEST or the JSON answer if everything worked correctly.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response play(@QueryParam(TRUMP_NAME) String trumpName,
            @QueryParam(TARGETED_PLAYER_INDEX) String targetIndex) {
        parameters.put(TRUMP_NAME, trumpName);
        parameters.put(TARGETED_PLAYER_INDEX, targetIndex);
        return getGameFactoryResponse();
    }

    @Override
    protected Response checkParametersAndGetResponse() {
        if (incorrectInputParemeters()) {
            String message = String
                    .format("Wrong input parameters. trumpName: %s., targetIndex: %s.",
                            parameters.get(TRUMP_NAME),
                            parameters.get(TARGETED_PLAYER_INDEX));
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
        return parameters.get(TRUMP_NAME) == null || invalidPlayerIndex();
    }

    /**
     * Check whether the asked player index is valid or not.
     *
     * Check that it can correctly parse as an integer.
     *
     * @return
     */
    protected boolean invalidPlayerIndex() {
        boolean canBeParseAsInteger = true;
        try {
            Integer.parseInt(parameters.get(TARGETED_PLAYER_INDEX));
        } catch (NumberFormatException exception) {
            canBeParseAsInteger = false;
        }

        return !canBeParseAsInteger;
    }

    @Override
    protected Response getResponse() {
        String trumpName = parameters.get(TRUMP_NAME);
        int targetIndex = Integer.parseInt(parameters.get(TARGETED_PLAYER_INDEX));

        if (match.canActivePlayerPlayTrump(trumpName, targetIndex)) {
            match.playTrumpCard(trumpName, targetIndex);
            return Response.status(Response.Status.OK).build();
        } else {
            String message = "You cannot play this trump.";
            return buildBadResponse(message);
        }
    }

}
