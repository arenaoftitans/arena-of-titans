package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import org.junit.Test;

/**
 * <b>Test class for RiderCard.</b>
 *
 * Test specific movement for the RiderCard.
 *
 * @author "Dernière Ligne" first development team
 */
public class RiderCardTest extends CardTest {

    public RiderCardTest() {
    }

    @Test
    public void testGetPossibleMovements() {
        setCurrentSquare(0, 8);

        expResult.add(new Square(1, 6, cardColor));

        test();
    }

    @Test
    public void testGetPossibleMovementsNoMovement() {
        setCurrentSquare(3, 8);

        test();
    }

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new RiderCard(board, cardColor);
    }

}
