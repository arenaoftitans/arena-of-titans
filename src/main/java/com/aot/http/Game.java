package com.aot.http;

import com.aot.engine.GameFactory;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet of the game.
 * @author jenselme
 */
public class Game extends HttpServlet {
    private static final String VIEW = "/WEB-INF/game.jsp";

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
        this.getServletContext().getRequestDispatcher(VIEW).forward(request, response);
    }
}
