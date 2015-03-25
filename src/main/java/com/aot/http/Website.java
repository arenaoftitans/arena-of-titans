
package com.aot.http;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "Website", urlPatterns = {"", "/rules", "/synopsis", "/playerPage"})
public class Website extends HttpServlet {

    private static final String INDEX = "/WEB-INF/index.jsp";
    private static final String RULES = "/WEB-INF/rules.jsp";
    private static final String SYNOPSIS = "/WEB-INF/synopsis.jsp";
    private static final String PLAYER_PAGE = "/WEB-INF/playerPage.jsp";

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        switch (request.getRequestURI()) {
            case "/rules":
                this.getServletContext().getRequestDispatcher(RULES).forward(request, response);
                break;
            case "/synopsis":
                this.getServletContext().getRequestDispatcher(SYNOPSIS).forward(request, response);
                break;
            case "/playerPage":
                this.getServletContext().getRequestDispatcher(PLAYER_PAGE).forward(request, response);
                break;
            case "/":
                this.getServletContext().getRequestDispatcher(INDEX).forward(request, response);
                break;
        }
    }

}
