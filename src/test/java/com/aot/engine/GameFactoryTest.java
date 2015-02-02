/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aot.engine;

import com.aot.engine.Color;
import com.aot.engine.GameFactory;
import com.aot.engine.board.Board;
import com.aot.engine.board.Square;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

/**
 *
 * @author jenselme
 */
public class GameFactoryTest {

    private GameFactory gameFactory;

    @Before
    public void init() {
        gameFactory = new GameFactory();
    }

    @Test
    public void testGetSvg() {
        gameFactory.getSvg();
    }

    @Test
    public void testGetBoard() {
        Board board = gameFactory.getBoard();

        assertEquals(9, board.getHeight());
        assertEquals(32, board.getWidth());
        assertEquals(new Square(0, 8, Color.RED), board.getSquare(0, 8));
        assertEquals(new Square(31, 8, Color.BLACK), board.getSquare(31, 8));
    }

}
