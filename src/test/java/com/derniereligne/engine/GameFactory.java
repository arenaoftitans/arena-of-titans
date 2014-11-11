/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine;

import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;

/**
 * <b>Create all element needed for a game (Board and Deck).</b>
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public class GameFactory {

    private final static String jsonFileName = "boards.json";
    protected final String boardName;
    protected final JsonBoard jsonBoard;
    private final int WIDTH;
    private final int HEIGHT;
    private final Square[][] board;
    private final int INNER_CIRCLE_HIGHER_Y;
    private final int ARMS_WIDTH;

    public GameFactory() {
        this("standard_board");
    }

    public GameFactory(String boardName) {
        this.boardName = boardName;
        try {
            URI resource = getClass().getResource(jsonFileName).toURI();
            String jsonString = FileUtils.readFileToString(new File(resource));

            Gson gson = new Gson();
            JsonParser parser = new JsonParser();
            JsonObject jsonObject = parser.parse(jsonString).getAsJsonObject();
            jsonBoard = gson.fromJson(jsonObject.get("standard_board"), JsonBoard.class);

            // Initialize the board.
            WIDTH = jsonBoard.getWidth();
            HEIGHT = jsonBoard.getHeight();
            INNER_CIRCLE_HIGHER_Y = jsonBoard.getInnerCircleHigherY();
            ARMS_WIDTH = jsonBoard.getArmsWidth();
            board = jsonBoard.getBoard(boardName);
        } catch (IOException | URISyntaxException ex) {
            Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    public Board getBoard() {
        return new Board(WIDTH, HEIGHT, INNER_CIRCLE_HIGHER_Y, ARMS_WIDTH, board);
    }

    public String getBoardName() {
        return boardName;
    }

}
