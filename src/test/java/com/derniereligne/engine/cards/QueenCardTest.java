package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import static com.derniereligne.engine.cards.CardTest.cardColor;
import org.junit.Test;

/**
 * <b>Test class for QueenCard.</b>
 *
 * Test specific movement for the QueenCard.
 *
 * @author "Dernière Ligne" first development team
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
    }

    @Test
    public void testGetPossibleMovementsNoMovement() {
        setCurrentSquare(0, 0);

        test();
    }

    @Test
    public void testGetPossibleMovementsMiddleArm() {
        setCurrentSquare(1, 6);

        expResult.add(new Square(0, 7, cardColor));
        expResult.add(new Square(0, 8, cardColor));
        expResult.add(new Square(2, 5, cardColor));
        expResult.add(new Square(3, 4, cardColor));

        test();
    }

}
