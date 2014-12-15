package com.derniereligne.http.rest;

import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.Match;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.cards.Deck;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

/**
 * <b>Rest servlet that returns the squares we can play.</b>
 *
 * Expect parameters: x, y, card, color.
 *
 * @author jenselme
 */
public abstract class GameRest {

    protected static final Response.ResponseBuilder BAD_REQUEST_BUILDER = Response.status(Response.Status.BAD_REQUEST);

    /**
     * The map of all parameters passed in the URL.
     */
    protected Map<String, String> parameters;
    /**
     * The GameFactory of the current game.
     */
    protected GameFactory gameFactory;
    /**
     * The Match the user is playing.
     */
    protected Match match;
    /**
     * The Board he is playing on.
     */
    protected Board board;
    /**
     * His currentPlayerDeck of cards.
     */
    protected Deck currentPlayerDeck;
    /**
     * The last card played.
     */
    protected MovementsCard playableCard;

    /**
     * The request done to the servlet.
     */
    @Context
    HttpServletRequest request;

    public GameRest() {
        parameters = new HashMap<>();
    }

    /**
     * Init the object's attributes.
     */
    protected void init() {
        match = gameFactory.getMatch();
        currentPlayerDeck = match.getActivePlayer().getDeck();
    }

    /**
     * Return the proper answer to the request, ie the JSON answer or a BAD_REQUEST.
     *
     * @return A JSON or BAD_REQUEST.
     */
    protected abstract Response getResponse();

    /**
     * Create the bad Response object based on a message.
     *
     * @param message The message to send to the client.
     * @return A JSON object containing the error message.
     */
    protected Response buildBadResponse(String message) {
        return BAD_REQUEST_BUILDER.entity("{\"error\": \"" + message + "\"}").build();
    }

    /**
     * Get the GameFactory from the session and then continue with parameters check.
     *
     * @return
     */
    protected Response getGameFactoryResponse() {
        gameFactory = (GameFactory) request.getSession().getAttribute("gameFactory");
        if (gameFactory == null) {
            return buildBadResponse("No match is running");
        }

        init();
        return checkParametersAndGetResponse();
    }

    /**
     * Check that the passed parameters are consistent and returns a Response (400 if there is a
     * problem) or goes on.
     *
     * @return A Response object.
     */
    protected abstract Response checkParametersAndGetResponse();

}
