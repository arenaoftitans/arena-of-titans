package com.aot.engine.api;

import com.aot.engine.cards.movements.MovementsCard;
import com.aot.engine.api.json.CardPlayedJsonResponseBuilder;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpSession;
import javax.websocket.EndpointConfig;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 * <b>Rest servlet that returns the squares we can play.</b>
 *
 * Expect parameters: x, y, card, color.
 *
 * @author jenselme
 */
@ServerEndpoint(value = "/api/play", configurator = GetHttpSessionConfigurator.class)
public class Play extends PossibleSquaresLister {

    @OnMessage
    public void play(String message, Session session) throws IOException {
        Gson gson = new Gson();
        parameters = gson.fromJson(message, Map.class);
        session.getBasicRemote().sendText(getGameFactoryResponse());
    }

    @Override
    protected String checkParametersAndGetResponse() {
        if (playerWantsToPassThisTurn()) {
            return passThisTurn();
        } else if (playerWantsToDiscardACard() && !areInputParemetersIncorrect()) {
            return discardCard();
        } else if (incorrectInputParemeters()) {
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
     * Returns true if the player wants to pass his/her turn.
     *
     * @return true if the player wants to pass his/her turn.
     */
    private boolean playerWantsToPassThisTurn() {
        return "true".equalsIgnoreCase(parameters.get(PASS));
    }

    /**
     * Pass the current active player's turn.
     *
     * @return The next player as a JSON.
     */
    private String passThisTurn() {
        match.passThisTurn();
        return CardPlayedJsonResponseBuilder.build(match);
    }

    private boolean playerWantsToDiscardACard() {
        return "true".equalsIgnoreCase(parameters.get(DISCARD_SELECTED_CARD));
    }

    private String discardCard() {
        String cardName = parameters.get(CARD_NAME);
        String cardColor = parameters.get(CARD_COLOR);
        MovementsCard cardToDiscard = currentPlayerDeck.getCard(cardName, cardColor);
        if (cardToDiscard == null) {
            String message = String.format("Unknown card: %s, %s", cardName, cardColor);
            return buildBadResponse(message);
        }

        match.discard(cardToDiscard);
        return CardPlayedJsonResponseBuilder.build(match);
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
    protected String getJsonResponse(List<String> possibleSquaresIds) {
        String x = parameters.get(X_COORD);
        String y = parameters.get(Y_COORD);
        String selectedSquareId = String.format("square-%s-%s", x, y);
        if (!possibleSquaresIds.contains(selectedSquareId)) {
            String message = "Invalid square.";
            return buildBadResponse(message);
        }

        int targetedX = Integer.parseInt(x);
        int targetedY = Integer.parseInt(y);
        match.playTurn(targetedX, targetedY, playableCard);

        return CardPlayedJsonResponseBuilder.build(match, targetedX, targetedY);
    }

}
