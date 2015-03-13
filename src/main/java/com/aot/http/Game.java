package com.aot.http;

import com.aot.engine.GameFactory;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "Game", urlPatterns = {"/game/*"})
public class Game extends HttpServlet {

    private static final String VIEW = "/WEB-INF/game.jsp";
    private static final String CREATE_GAME = "/createGame";

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
        if (gameId == null || !gameExists(gameId)) {
            response.setStatus(HttpServletResponse.SC_MOVED_TEMPORARILY);
            response.setHeader("location", CREATE_GAME);
        } else {
            this.getServletContext().getRequestDispatcher(VIEW).forward(request, response);
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

    private boolean gameExists(String id) {
        return true;
    }

}
