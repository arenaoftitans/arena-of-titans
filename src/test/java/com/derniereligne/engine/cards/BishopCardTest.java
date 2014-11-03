package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import org.junit.Test;

/**
 * <b>Test class for BishopCard.</b>
 *
 * Test specific movement for the BishopCard.
 *
 * @author "Dernière Ligne" first development team
 */
public class BishopCardTest extends CardTest {

    public BishopCardTest() {
    }

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
