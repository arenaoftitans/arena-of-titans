package com.aot.engine.api;

import com.aot.engine.GameFactory;
import com.aot.engine.Match;
import com.aot.engine.board.Board;
import com.aot.engine.cards.Deck;
import com.aot.engine.cards.movements.MovementsCard;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.websocket.EndpointConfig;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.ws.rs.core.Response;

/**
 * <b>Rest servlet that returns the squares we can play.</b>
 *
 * Expect parameters: x, y, card, color.
 *
 * @author jenselme
 */
public abstract class GameApi {

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
    protected Session wsSession;
    protected HttpSession httpSession;

    public GameApi() {
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
    protected abstract String getResponse();

    /**
     * Create the bad Response object based on a message.
     *
     * @param message The message to send to the client.
     * @return A JSON object containing the error message.
     */
    protected String buildBadResponse(String message) {
        return "{\"error\": \"" + message + "\"}";
    }

    /**
     * Get the GameFactory from the session and then continue with parameters check.
     *
     * @return
     */
    protected String getGameFactoryResponse() {
        gameFactory = (GameFactory) httpSession.getAttribute("gameFactory");
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
    protected abstract String checkParametersAndGetResponse();

    @OnOpen
    public void open(Session session, EndpointConfig config) {
        this.wsSession = session;
        this.httpSession = (HttpSession) config.getUserProperties()
                .get(HttpSession.class.getName());
    }

}
