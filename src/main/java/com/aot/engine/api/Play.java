package com.aot.engine.api;

import com.aot.engine.cards.movements.MovementsCard;
import com.aot.engine.api.json.CardPlayedJsonResponseBuilder;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.List;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

/**
 * <b>Rest servlet that returns the squares we can play.</b>

 Expect wsMove: x, y, card, color.
 *
 * @author jenselme
 */
@ServerEndpoint(value = "/api/play/{id}", configurator = GetHttpSessionConfigurator.class)
public class Play extends PossibleSquaresLister {

    @OnMessage
    public void play(@PathParam("id") String id, String message, Session session) throws IOException {
        this.gameId = id;
        Gson gson = new Gson();
        wsMove = gson.fromJson(message, WsMove.class);
        session.getBasicRemote().sendText(getGameFactoryResponse());
    }

    @Override
    protected String checkParametersAndGetResponse() {
        if (wsMove.isPass()) {
            return passThisTurn();
        } else if (wsMove.isDiscard()&& !areInputParemetersIncorrect()) {
            return discardCard();
        } else if (incorrectInputParemeters()) {
            String message = String
                    .format("Wrong input parameters. CardName: %s. CardColor: %s. PlayerId: %s. X: %s. Y: %s.",
                            wsMove.getCardName(),
                            wsMove.getCardColor(),
                            wsMove.getPlayerId(),
                            wsMove.getX(),
                            wsMove.getY());
            return buildBadResponse(message);
        }

        return getResponse();
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

    private String discardCard() {
        String cardName = wsMove.getCardName();
        String cardColor = wsMove.getCardColor();
        MovementsCard cardToDiscard = match.getActivePlayerDeck().getCard(cardName, cardColor);
        if (cardToDiscard == null) {
            String message = String.format("Unknown card: %s, %s", cardName, cardColor);
            return buildBadResponse(message);
        }

        match.discard(cardToDiscard);
        return CardPlayedJsonResponseBuilder.build(match);
    }

    /**
     * Return true if the input wsMove are incorrect.
     *
     * @return true or false.
     */
    protected boolean incorrectInputParemeters() {
        return areInputParemetersIncorrect() || incorrectCoordinates();
    }

    /**
     * Return true if one of the coordinates passed as wsMove is null.
     *
     * @return true or false.
     */
    protected boolean incorrectCoordinates() {
        return wsMove.getX() == null || wsMove.getY() == null;
    }

    @Override
    protected String getJsonResponse(List<String> possibleSquaresIds) {
        int x = wsMove.getX();
        int y = wsMove.getY();
        String selectedSquareId = String.format("square-%s-%s", x, y);
        if (!possibleSquaresIds.contains(selectedSquareId)) {
            String message = "Invalid square.";
            return buildBadResponse(message);
        }

        match.playTurn(x, y, playableCard);

        return CardPlayedJsonResponseBuilder.build(match, x, y);
    }

}
