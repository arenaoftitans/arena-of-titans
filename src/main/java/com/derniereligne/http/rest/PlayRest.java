package com.derniereligne.http.rest;

import com.derniereligne.engine.cards.movements.MovementsCard;
import com.derniereligne.http.rest.json.CardPlayedJsonResponseBuilder;
import java.util.List;
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
     * @param pass If this parameter is true, the player want to pass his/her turn.
     *
     * @param discard If instead of playing the selected card, the player wants to discard it.
     *
     * @return A BAD_REQUEST or the JSON answer if everything worked correctly.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response play(@QueryParam(CARD_NAME) String cardName,
            @QueryParam(CARD_COLOR) String cardColor,
            @QueryParam(PLAYER_ID) String playerId,
            @QueryParam(X_COORD) String x,
            @QueryParam(Y_COORD) String y,
            @QueryParam(PASS) String pass,
            @QueryParam(DISCARD_SELECTED_CARD) String discard) {
        parameters.put(CARD_NAME, cardName);
        parameters.put(CARD_COLOR, cardColor);
        parameters.put(PLAYER_ID, playerId);
        parameters.put(X_COORD, x);
        parameters.put(Y_COORD, y);
        parameters.put(PASS, pass);
        parameters.put(DISCARD_SELECTED_CARD, discard);
        return getGameFactoryResponse();
    }

    @Override
    protected Response checkParametersAndGetResponse() {
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
    private Response passThisTurn() {
        match.passThisTurn();
        return CardPlayedJsonResponseBuilder.build(match);
    }

    private boolean playerWantsToDiscardACard() {
        return "true".equalsIgnoreCase(parameters.get(DISCARD_SELECTED_CARD));
    }

    private Response discardCard() {
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
    protected Response getJsonResponse(List<String> possibleSquaresIds) {
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

        return CardPlayedJsonResponseBuilder.build(match, selectedSquareId);
    }

}
