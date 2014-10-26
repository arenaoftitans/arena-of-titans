/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards;

import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.cards.QueenCard;
import com.derniereligne.engine.Color;
import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import java.util.HashSet;
import java.util.Set;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author jenselme
 */
public class QueenCardTest {

    public QueenCardTest() {
    }

    /**
     * Test of getPossibleMovements method, of class QueenCard.
     */
    @Test
    public void testGetPossibleMovements() {
        System.out.println("getPossibleMovements: start point");
        Board board = new Board("test_board");
        Square currentSquare = board.getSquare(0, 9);
        currentSquare.setAsOccupied();
        Color color = Color.RED;
        QueenCard instance = new QueenCard(board, color);

        Set<Square> expResult = new HashSet<>();
        expResult.add(new Square(0, 8, color));
        expResult.add(new Square(1, 7, color));

        Set<Square> result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        System.out.println("getPossibleMovements: no movement");
        currentSquare.empty();
        currentSquare = board.getSquare(0, 0);
        currentSquare.setAsOccupied();

        expResult = new HashSet<>();

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        System.out.println("getPossibleMovements: on the edge");
        currentSquare.empty();
        currentSquare = board.getSquare(3, 4);
        currentSquare.setAsOccupied();

        expResult = new HashSet<>();
        expResult.add(new Square(3, 5, color));
        expResult.add(new Square(2, 6, color));

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }

}
