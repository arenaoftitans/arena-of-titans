/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import static com.derniereligne.engine.cards.CardTest.cardColor;
import org.junit.Test;

/**
 *
 * @author jenselme
 */
public class QueenCardTest extends CardTest {

    public QueenCardTest() {
    }

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new QueenCard(board, cardColor);
    }

    @Test
    public void testGetPossibleMovements() {
        setCurrentSquare(0, 8);

        expResult.add(new Square(0, 7, cardColor));
        expResult.add(new Square(1, 6, cardColor));

        test();

        setCurrentSquare(0, 0);

        test();

        setCurrentSquare(1, 6);

        expResult.add(new Square(0, 7, cardColor));
        expResult.add(new Square(0, 8, cardColor));
        expResult.add(new Square(2, 5, cardColor));
        expResult.add(new Square(3, 4, cardColor));

        test();
    }

}
