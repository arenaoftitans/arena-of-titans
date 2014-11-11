/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine;

import com.derniereligne.engine.board.Square;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author jenselme
 */
public class JsonBoardTest extends GameFactory {

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
