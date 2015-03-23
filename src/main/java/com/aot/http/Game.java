package com.aot.http;

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

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String gameId = getGameId(request);
        if (gameId == null) {
            gameId = new BigInteger(100, new SecureRandom()).toString(32);
            response.setStatus(HttpServletResponse.SC_MOVED_TEMPORARILY);
            response.setHeader("location", "/game/" + gameId);
        } else {
            this.getServletContext().getRequestDispatcher(GAME_VIEW).forward(request, response);
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

}
