
package com.aot.http;

import com.aot.engine.GameFactory;
import com.aot.engine.api.Redis;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "getBoard", urlPatterns = {"/getBoard/*"})
public class GetBoard extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Redis redis = (Redis) getServletContext().getAttribute(Redis.REDIS_SERVLET);
        String boardName = getBoardName(request);
        String board = redis.getBoard(boardName);

        if (board == null) {
            Logger.getLogger(GetBoard.class.getCanonicalName()).log(Level.INFO,
                    "Regenerated board {0}", boardName);
            GameFactory gf = new GameFactory();
            board = gf.getSvg();
            redis.saveBoard(boardName, board);
        }

        writeResponse(response, board);
    }

    private String getBoardName(HttpServletRequest request) {
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

    private void writeResponse(HttpServletResponse response, String board) throws IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.println("<div>" + board + "</div>");
        }
    }

}
