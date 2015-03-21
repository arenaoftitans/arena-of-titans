package com.aot.engine.api;

import com.aot.engine.api.json.CardPlayedJsonResponseBuilder;
import com.aot.engine.api.json.GameApiJson;
import com.aot.engine.api.json.PossibleSquaresJson;
import com.aot.engine.api.json.TrumpPlayedJsonResponseBuilder;
import com.aot.engine.board.Square;
import com.aot.engine.cards.movements.MovementsCard;
import com.aot.engine.trumps.Trump;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import javax.websocket.CloseReason;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/api/game/{id}", configurator = GetRedis.class)
public class GameApi extends WebsocketApi {

    private String playerId;
    private GameApiJson.PlayerRequest playerRequest;
    private GameApiJson.PlayRequest playRequest;
    private GameApiJson.PlayTrumpRequest playTrumpRequest;

    @OnOpen
    public void open(@PathParam("id") String id, Session session, EndpointConfig config) throws IOException {
        if (match == null) {
            initializeMatch(id, session, config);
        }

        if (session.isOpen()) {
            String sessionId = session.getId();
            players.put(sessionId, session);
            redis.saveSessionId(gameId, sessionId);
        }
    }

    private void initializeMatch(String id, Session session, EndpointConfig config) throws IOException {
        gameId = id;
        redis = (Redis) config.getUserProperties().get(Redis.REDIS_SERVLET);
        match = redis.getMatch(id);

        if (match == null) {
            CloseReason.CloseCode cc = () -> 1002;
            CloseReason cr = new CloseReason(cc, "No match is running");
            session.close(cr);
        }
    }

    @OnClose
    public void close(Session session) {
        String sessionId = session.getId();
        removeSessionId(sessionId);
    }

    @OnMessage
    public void gameMessage(String message, Session session)
            throws IOException {
        String response;
        Gson gson = new Gson();
        playerRequest = gson.fromJson(message, GameApiJson.PlayerRequest.class);
        playerId = playerRequest.getPlayerId();

        if (playerRequest.isPlayerIdCorrect(match)) {
            match = redis.getMatch(gameId);
            response = playGame();
            redis.saveMatch(match);
            sendResponseToAllPlayers(response);
        } else {
            response = GameApiJson.buildErrorToDisplay("Not your turn");
            session.getBasicRemote().sendText(response);
        }
    }

    private String playGame() {
        String response;

        switch (playerRequest.getRequestType()) {
            case VIEW_POSSIBLE_SQUARES:
                playRequest = playerRequest.getPlayRequest();
                response = listOfPossibleSquares();
                break;
            case PLAY:
                playRequest = playerRequest.getPlayRequest();
                response = play();
                break;
            case PLAY_TRUMP:
                playTrumpRequest = playerRequest.getPlayTrumpRequest();
                response = playTrump();
                break;
            default:
                response = GameApiJson.buildError("Unknow resquest type.");
                break;
        }

        return response;
    }

    private String listOfPossibleSquares() {
        String response;

        if (playRequest.nonNullCardNameAndColor(match)) {
            response = listSquaresFromCurrentSquare();
        } else {
            String message = String
                    .format("Wrong input parameters. CardName: %s. CardColor: %s. PlayerId: %s.",
                            playRequest.getCardName(),
                            playRequest.getCardColor(),
                            playerId);
            response = GameApiJson.buildError(message);
        }

        return response;
    }

    private String listSquaresFromCurrentSquare() {
        String response;
        Square currentSquare = match.getActivePlayerCurrentSquare();

        if (currentSquare != null) {
            response = listSquaresForPlayedCard(currentSquare);
        } else {
            response = GameApiJson.buildError("Cannot get square.");
        }

        return response;
    }

    private String listSquaresForPlayedCard(Square currentSquare) {
        String response;

        MovementsCard playedCard = getPlayedCard();

        if (playedCard != null) {
            response = PossibleSquaresJson.get(playedCard, currentSquare, "possible_squares");
        } else {
            response = cannotGetCardMessage();
        }

        return response;
    }

    private MovementsCard getPlayedCard() {
        return match.getActivePlayerDeck().getCard(playRequest.getCardName(), playRequest.getCardColor());
    }

    private String cannotGetCardMessage() {
        String message = String.format("Cannot get the selected card: %s, %s.",
                playRequest.getCardName(), playRequest.getCardColor());
        return GameApiJson.buildError(message);
    }

    private String play() {
        String response;

        if (playRequest.pass()) {
            response = passThisTurn();
        } else if (playRequest.nonNullCardNameAndColor(match)) {
            response = playOrDiscardCard();
        } else {
            String message = String.format("Wrong card: %s, %s", playRequest.getCardName(), playRequest.getCardColor());
            response = GameApiJson.buildError(message);
        }

        return response;
    }

    private String passThisTurn() {
        match.passThisTurn();
        return CardPlayedJsonResponseBuilder.build(match, "play");
    }

    private String playOrDiscardCard() {
        if (playRequest.discard()) {
            return discardCard();
        } else {
            return playCard();
        }
    }

    private String discardCard() {
        String cardName = playRequest.getCardName();
        String cardColor = playRequest.getCardColor();
        MovementsCard cardToDiscard = match.getActivePlayerDeck().getCard(cardName, cardColor);

        String response;
        if (cardToDiscard != null) {
            match.discard(cardToDiscard);
            response = CardPlayedJsonResponseBuilder.build(match, "play");
        } else {
            String message = String.format("Unknown card: %s, %s", cardName, cardColor);
            response = GameApiJson.buildError(message);
        }

        return response;
    }

    private String playCard() {
        String response;
        MovementsCard playedCard = getPlayedCard();
        Square currentSquare = match.getActivePlayerCurrentSquare();

        if (playRequest.nonNullDestinationCoordinates() && playedCard != null && currentSquare != null) {
            response = moveToNewSquare(playedCard, currentSquare);
        } else {
            String message = String
                    .format("Wrong input parameters. %s.\n.CardName: %s. CardColor: %s. PlayerId: %s. X: %s. Y: %s.",
                            getComplementaryMessage(playedCard, currentSquare),
                            playRequest.getCardName(),
                            playRequest.getCardColor(),
                            playerId,
                            playRequest.getX(),
                            playRequest.getY());
            response = GameApiJson.buildError(message);
        }

        return response;
    }

    private String moveToNewSquare(MovementsCard playedCard, Square currentSquare) {
        String response;
        List< String> possibleSquaresIds = new ArrayList<>(playedCard.getPossibleMovements(currentSquare));
        int x = playRequest.getX();
        int y = playRequest.getY();
        String selectedSquareId = String.format("square-%s-%s", x, y);

        if (possibleSquaresIds.contains(selectedSquareId)) {
            match.playCard(x, y, playedCard);
            response = CardPlayedJsonResponseBuilder.build(match, x, y, "play");
        } else {
            response = GameApiJson.buildError("Invalid destination.");
        }

        return response;
    }

    private String getComplementaryMessage(MovementsCard playedCard, Square currentSquare) {
        String message;
        if (playedCard == null) {
            message = "Cannot get the selected card.";
        } else if (currentSquare == null) {
            message = "Cannot get active player's current square.";
        } else {
            message = "At least one of the destination coordinates is null.";
        }

        return message;
    }

    private String playTrump() {
        String response;
        Trump trump = getTrump();
        if (trump != null) {
            response = playThisTrump(trump);
        } else {
            String message = String
                    .format("Wrong input parameters. trumpName: %s., targetIndex: %s.",
                            playTrumpRequest.getTrumpName(),
                            playTrumpRequest.getTargetIndex());
            response = GameApiJson.buildError(message);
        }

        return response;
    }

    private Trump getTrump() {
        String trumpName = playTrumpRequest.getTrumpName();
        if (trumpName == null) {
            return null;
        } else {
            try {
                return match.getTrumpForActivePlayer(trumpName);
            } catch (NoSuchElementException ex) {
                return null;
            }
        }
    }

    private String playThisTrump(Trump trump) {
        String response;
        Integer targetIndex = playTrumpRequest.getTargetIndex();

        if (match.canActivePlayerPlayTrump(trump, targetIndex)) {
            match.playTrump(trump, targetIndex);
            response = TrumpPlayedJsonResponseBuilder.build(match);
        } else {
            response = GameApiJson.buildError("You cannot play this trump.");
        }

        return response;
    }

}
