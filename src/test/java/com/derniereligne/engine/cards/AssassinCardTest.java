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
public class AssassinCardTest extends CardTest {

    @Test
    public void getPossibleMovements() {
        setCurrentSquare(0, 8);
        expResult.add(new Square(0, 7, cardColor));
        expResult.add(new Square(1, 6, cardColor));

        test();
    }

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new AssassinCard(board, cardColor);
    }

}
