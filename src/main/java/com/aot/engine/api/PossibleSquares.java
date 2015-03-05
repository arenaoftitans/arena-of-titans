package com.aot.engine.api;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value="/api/getPossibleSquares", configurator=GetHttpSessionConfigurator.class)
public class PossibleSquares extends PossibleSquaresLister {

    @OnMessage
    public void getPossibleSquares(String message, Session session) throws IOException {
        Gson gson = new Gson();
        wsMove = gson.fromJson(message, WsMove.class);
        session.getBasicRemote().sendText(getGameFactoryResponse());
    }

    @Override
    protected String checkParametersAndGetResponse() {
        if (areInputParemetersIncorrect()) {
            String message = String
                    .format("Wrong input parameters. CardName: %s. CardColor: %s. PlayerId: %s.",
                            wsMove.getCardName(),
                            wsMove.getCardColor(),
                            wsMove.getPlayerId());
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
