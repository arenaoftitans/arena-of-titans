package com.aot.engine.api;

import com.aot.engine.trumps.Trump;
import com.aot.engine.api.json.TrumpPlayedJsonResponseBuilder;
import java.util.NoSuchElementException;
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

    private Trump trump;

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
        trump = getTrump();
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
     * Get the trump by the given name or null if the trump doesn't exist.
     *
     * @return The trump.
     */
    private Trump getTrump() {
        if (parameters.get(TRUMP_NAME) == null) {
            return null;
        } else {
            try {
                String trumpName = parameters.get(TRUMP_NAME);
                return match.getTrumpForActivePlayer(trumpName);
            } catch (NoSuchElementException ex) {
                return null;
            }
        }
    }

    /**
     * Return true if the input parameters are incorrect.
     *
     * @return true or false.
     */
    protected boolean incorrectInputParemeters() {
        return trump == null || invalidPlayerIndex();
    }

    /**
     * Check whether the asked player index is valid or not.
     *
     * Check that it can correctly parse as an integer.
     *
     * @return
     */
    protected boolean invalidPlayerIndex() {
        if (trump.mustTargetPlayer()) {
            return canBeParsedAsInteger(parameters.get(TARGETED_PLAYER_INDEX));
        } else {
            return false;
        }
    }

    private boolean canBeParsedAsInteger(String string) {
        boolean canBeParseAsInteger = true;
        try {
            Integer.parseInt(string);
        } catch (NumberFormatException exception) {
            canBeParseAsInteger = false;
        }

        return !canBeParseAsInteger;
    }

    @Override
    protected Response getResponse() {
        if (match.canActivePlayerPlayTrump(trump)) {
            match.playTrump(trump);
            return TrumpPlayedJsonResponseBuilder.build(match);
        }

        int targetIndex = Integer.parseInt(parameters.get(TARGETED_PLAYER_INDEX));
        if (match.canActivePlayerPlayTrump(trump, targetIndex)) {
            match.playTrump(trump, targetIndex);
            return TrumpPlayedJsonResponseBuilder.build(match);
        }

        String message = "You cannot play this trump.";
        return buildBadResponse(message);
    }

}
