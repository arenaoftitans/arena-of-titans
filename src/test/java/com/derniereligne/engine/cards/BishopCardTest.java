/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards;

import com.derniereligne.engine.board.Board;
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
public class BishopCardTest {

    public BishopCardTest() {
    }

    /**
     * Test of getPossibleMovements method, of class BishopCard.
     */
    @Test
    public void testGetPossibleMovements() {
        System.out.println("getPossibleMovements");
        Board board = new Board();
        // Up left
        Square currentSquare = board.getSquare(31, 2);
        currentSquare.setAsOccupied();
        Color color = Color.RED;
        BishopCard instance = new BishopCard(board, color);

        Set<Square> expResult = new HashSet<>();
        expResult.add(new Square(0, 3, color));
        expResult.add(new Square(1, 2, Color.BLACK));

        Set<Square> result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }

}
