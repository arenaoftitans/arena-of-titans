/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import com.google.gson.Gson;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

/**
 *
 * @author jenselme
 */
public class JsonBoardTest {

    private JsonBoard jsonBoard;
    private static final String boardName = "standard_board";
    private static final String jsonFileName = "/com/derniereligne/engine/board/boards.json";

    @Before
    public void initJsonBoard() {
        try {
            URI resource = getClass().getResource(jsonFileName).toURI();
            String jsonString = FileUtils.readFileToString(new File(resource));

            // We must correct the json we get from the file in order for gson
            // to find the correct key and to correctly map the boards to their
            // representation.
            jsonString = "{\"boards\":" + jsonString + "}";

            Gson gson = new Gson();
            JsonGame jsonGame = gson.fromJson(jsonString, JsonGame.class);
            jsonBoard = jsonGame.get(boardName);
        } catch (IOException | URISyntaxException ex) {
            Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    @Test
    public void testGetInnerCircleHigherY() {
        assertEquals(2, jsonBoard.getInnerCircleHigherY());
    }

    @Test
    public void testGetHeight() {
        assertEquals(9, jsonBoard.getHeight());
    }

    @Test
    public void testGetWidth() {
        assertEquals(32, jsonBoard.getWidth());
    }

    @Test
    public void testGetArmsWidth() {
        assertEquals(4, jsonBoard.getArmsWidth());
    }

    @Test
    public void testGetBoard() {
        Square[][] board = jsonBoard.getBoard(boardName);

        assertEquals(9, board.length);
        assertEquals(32, board[0].length);
        assertEquals(new Square(0, 8, Color.RED), board[8][0]);
    }

    @Test
    public void testGetDisposition() {
        String[][] disposition = jsonBoard.getDisposition(boardName);

        assertEquals(9, disposition.length);
        assertEquals(32, disposition[0].length);
        assertEquals("RED", disposition[8][0]);
    }

}
