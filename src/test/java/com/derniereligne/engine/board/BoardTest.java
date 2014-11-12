/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.GameFactory;
import java.util.HashSet;
import java.util.Set;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

/**
 *
 * @author jenselme
 */
public class BoardTest {

    private Board board;
    private Set<Color> possibleColors;

    @Before
    public void initBoard() {
        board = new GameFactory().getBoard();
        possibleColors = new HashSet<>();
        possibleColors.add(Color.ALL);
    }

    @Test
    public void testCorrectAbsNegativeAbs() {
        assertEquals(28, board.correctAbs(-4));
        assertEquals(19, board.correctAbs(-13));
    }

    @Test
    public void testCorrectAbs() {
        assertEquals(0, board.correctAbs(32));
        assertEquals(1, board.correctAbs(33));
    }

    @Test
    public void testGetLineSquares() {
        Set<Square> expResult = new HashSet<>();
        expResult.add(board.getSquare(0, 7));
        expResult.add(board.getSquare(1, 8));
        expResult.add(null);

        Square startSquare = board.getSquare(0, 8);

        assertEquals(expResult, board.getLineSquares(startSquare, possibleColors));
    }

    @Test
    public void testGetLineSquareOccupiedSquare() {
        Set<Square> expResult = new HashSet<>();
        expResult.add(board.getSquare(0, 7));
        expResult.add(board.getSquare(1, 8));
        expResult.add(null);

        Square startSquare = board.getSquare(0, 8);

        board.getSquare(0, 7).setAsOccupied();
        assertEquals(expResult, board.getLineSquares(startSquare, possibleColors));
    }

    @Test
    public void testGetUpSquare() {
        Square startSquare = board.getSquare(0, 7);

        assertEquals(board.getSquare(0, 8), board.getUpSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetUpSquareOutOfTheBoard() {
        Square startSquare = board.getSquare(0, 8);

        assertEquals(null, board.getUpSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetUpSquareSquareOccupied() {
        Square startSquare = board.getSquare(0, 7);
        board.getSquare(0, 8).setAsOccupied();

        assertEquals(board.getSquare(0, 8), board.getUpSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetUpSquareWrongColor() {
        Square startSquare = board.getSquare(0, 7);
        possibleColors = new HashSet<>();
        possibleColors.add(Color.YELLOW);

        assertEquals(null, board.getUpSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetDownSquare() {
        Square startSquare = board.getSquare(0, 8);

        assertEquals(board.getSquare(0, 7), board.getDownSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetDownSquareOutOfTheBoard() {
        Square startSquare = board.getSquare(0, 0);

        assertEquals(null, board.getDownSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetDownSquareSquareOccupied() {
        Square startSquare = board.getSquare(0, 8);
        board.getSquare(0, 7).setAsOccupied();

        assertEquals(board.getSquare(0, 7), board.getDownSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetDownSquareWrongColor() {
        Square startSquare = board.getSquare(0, 8);
        possibleColors = new HashSet<>();
        possibleColors.add(Color.BLACK);

        assertEquals(null, board.getDownSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetLeftSquare_Square() {
        Square startSquare = board.getSquare(1, 8);

        assertEquals(board.getSquare(0, 8), board.getLeftSquare(startSquare));
    }

    @Test
    public void testGetLeftSquare_SquareOutOfTheBoard() {
        Square startSquare = board.getSquare(0, 8);

        assertEquals(null, board.getLeftSquare(startSquare));
    }

    @Test
    public void testGetLeftSquare_SquareOccupiedSquare() {
        board.getSquare(0, 8).setAsOccupied();
        Square startSquare = board.getSquare(1, 8);

        assertEquals(board.getSquare(0, 8), board.getLeftSquare(startSquare));
    }

    @Test
    public void testGetLeftSquare_Square_Set() {
        Square startSquare = board.getSquare(1, 8);
        possibleColors = new HashSet<>();
        possibleColors.add(Color.RED);

        assertEquals(board.getSquare(0, 8), board.getLeftSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetLeftSquare_Square_SetWrongColor() {
        Square startSquare = board.getSquare(1, 8);
        possibleColors = new HashSet<>();
        possibleColors.add(Color.BLACK);

        assertEquals(null, board.getLeftSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetRightSquare_Square() {
        Square startSquare = board.getSquare(0, 8);

        assertEquals(board.getSquare(1, 8), board.getRightSquare(startSquare));
    }

    @Test
    public void testGetRightSquare_SquareOutOfTheBoard() {
        Square startSquare = board.getSquare(3, 8);

        assertEquals(null, board.getRightSquare(startSquare));
    }

    @Test
    public void testGetRightSquare_SquareOccupiedSquare() {
        board.getSquare(1, 8).setAsOccupied();
        Square startSquare = board.getSquare(0, 8);

        assertEquals(board.getSquare(1, 8), board.getRightSquare(startSquare));
    }

    @Test
    public void testGetRightSquare_Square_Set() {
        Square startSquare = board.getSquare(1, 8);
        possibleColors = new HashSet<>();
        possibleColors.add(Color.YELLOW);

        assertEquals(board.getSquare(2, 8), board.getRightSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetRightSquare_Square_SetWrongColor() {
        Square startSquare = board.getSquare(3, 8);
        possibleColors = new HashSet<>();
        possibleColors.add(Color.BLACK);

        assertEquals(null, board.getRightSquare(startSquare, possibleColors));
    }

    @Test
    public void testGetDiagonalSquares() {
        Set<Square> expResult = new HashSet<>();
        expResult.add(board.getSquare(1, 6));
        expResult.add(board.getSquare(1, 8));
        expResult.add(null);

        Square startSquare = board.getSquare(0, 7);

        assertEquals(expResult, board.getDiagonalSquares(startSquare, possibleColors));
    }

    @Test
    public void testGetDiagonalSquaresOccupiedSquare() {
        Set<Square> expResult = new HashSet<>();
        expResult.add(board.getSquare(1, 6));
        expResult.add(board.getSquare(1, 8));
        expResult.add(null);

        Square startSquare = board.getSquare(0, 7);

        board.getSquare(1, 6).setAsOccupied();
        assertEquals(expResult, board.getDiagonalSquares(startSquare, possibleColors));
    }

}
