package com.aot.http;

import com.aot.engine.GameFactory;
import com.aot.engine.api.Redis;
import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "Game", urlPatterns = {"/game/*"})
public class Game extends HttpServlet {

    private static final String GAME_VIEW = "/WEB-INF/game.jsp";
    private static final String CREATE_GAME_VIEW = "/WEB-INF/createGame.jsp";

    private GameFactory gameFactory;
    private String svgBoard;

    @Override
    public void init() {
        gameFactory = new GameFactory();
        svgBoard = gameFactory.getSvg();
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setAttribute("svgBoard", svgBoard);
        String gameId = getGameId(request);
        if (gameId == null) {
            gameId = new BigInteger(100, new SecureRandom()).toString(32);
            response.setStatus(HttpServletResponse.SC_MOVED_TEMPORARILY);
            response.setHeader("location", "/game/" + gameId);
        } else if (gameExists(gameId)) {
            this.getServletContext().getRequestDispatcher(GAME_VIEW).forward(request, response);
        } else {
            createGame(request, response);
        }
    }

    private String getGameId(HttpServletRequest request) {
        String pathInfo = request.getPathInfo();
        if (pathInfo == null) {
            pathInfo = "";
        }

        String[] pathInfoParts = pathInfo.split("/");
        if (pathInfoParts.length == 2) {
            return pathInfoParts[1];
        } else {
            return null;
        }
    }

    private boolean gameExists(String gameId) {
        Redis redis = (Redis) getServletContext().getAttribute(Redis.REDIS_SERVLET);
        return redis.doesGameExists(gameId);
    }

    private void createGame(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        getServletContext().getRequestDispatcher(CREATE_GAME_VIEW).forward(request, response);
    }

}
