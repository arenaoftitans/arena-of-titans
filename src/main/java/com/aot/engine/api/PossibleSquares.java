package com.aot.engine.api;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 * <b>Rest servlet that returns the squares we can play.</b>
 *
 * Expect parameters: x, y, card, color.
 *
 * @author jenselme
 */
@ServerEndpoint(value="/api/getPossibleSquares", configurator=GetHttpSessionConfigurator.class)
public class PossibleSquares extends PossibleSquaresLister {

    @OnMessage
    public void getPossibleSquares(String message, Session session) throws IOException {
        Gson gson = new Gson();
        parameters = gson.fromJson(message, Map.class);
        session.getBasicRemote().sendText(getGameFactoryResponse());
    }

    @Override
    protected String checkParametersAndGetResponse() {
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
    protected String getJsonResponse(List<String> possibleSquaresIds) {
        Gson gson = new Gson();
        Collections.sort(possibleSquaresIds);
        String output = gson.toJson(possibleSquaresIds);

        return output;
    }

}
