/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import org.junit.Test;

/**
 *
 * @author jenselme
 */
public class BishopCardTest extends CardTest {

    public BishopCardTest() {
    }

    /**
     * Test of getPossibleMovements method, of class BishopCard.
     */
    @Test
    public void testGetPossibleMovements() {
        setCurrentSquare(31, 2);

        expResult.add(new Square(0, 3, Color.BLACK));
        expResult.add(new Square(1, 2, Color.BLACK));

        test();
    }

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new BishopCard(board, cardColor);
    }

}
