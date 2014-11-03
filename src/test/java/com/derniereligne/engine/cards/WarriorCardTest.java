package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import org.junit.Test;

/**
 * <b>Test class for WarriorCard.</b>
 *
 * Test specific movement for the WarriorCard.
 *
 * @author "Dernière Ligne" first development team
 */
public class WarriorCardTest extends CardTest {

    public WarriorCardTest() {
    }

    @Test
    public void testGetPossibleMovementsOnCircle() {
        setCurrentSquare(0, 0);

        expResult.add(new Square(1, 0, cardColor));
        expResult.add(new Square(31, 0, cardColor));

        test();
    }

    @Test
    public void testGetPossibleMovementsNoDiagonal() {
        setCurrentSquare(2, 8);
        currentSquare.empty();

        expResult.add(new Square(2, 7, cardColor));

        test();
    }

    @Override
    public void initCard() {
        cardColor = Color.YELLOW;
        instance = new WarriorCard(board, cardColor);
    }

}
