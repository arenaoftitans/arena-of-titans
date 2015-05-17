package com.aot.http;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigInteger;
import java.security.SecureRandom;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "Game", urlPatterns = {"/api/newId"})
public class Game extends HttpServlet {

    private static final String GAME_VIEW = "/WEB-INF/game.jsp";

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String gameId = new BigInteger(100, new SecureRandom()).toString(32);
        response.setContentType("text/plain");
        response.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = response.getWriter();
        out.print(gameId);
    }

}
