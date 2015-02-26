package com.aot.engine.api;

import com.aot.engine.trumps.Trump;
import com.aot.engine.api.json.TrumpPlayedJsonResponseBuilder;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.Map;
import java.util.NoSuchElementException;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 * <b>Rest servlet that plays a trump card.</b>
 *
 * Expect parameters: card_name.
 *
 * @author jenselme
 */
@ServerEndpoint(value="/api/playTrump",  configurator=GetHttpSessionConfigurator.class)
public class PlayTrumpRest extends GameApi {

    private static final String TRUMP_NAME = "name";
    private static final String TARGETED_PLAYER_INDEX = "targetIndex";

    private Trump trump;

    @OnMessage
    public void play(String message, Session session) throws IOException {
        Gson gson = new Gson();
        parameters = gson.fromJson(message, Map.class);
        session.getBasicRemote().sendText(getGameFactoryResponse());
    }

    @Override
    protected String checkParametersAndGetResponse() {
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
    protected String getResponse() {
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
