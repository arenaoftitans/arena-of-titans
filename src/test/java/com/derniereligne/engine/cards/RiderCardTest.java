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
    public void testGetPossibleMovementsNoMovement() {
        setCurrentSquare(3, 8);

        test();
    }

    @Test
    public void testGetPossibleMovementsUpRight() {
        setCurrentSquare(0, 8);
        expResult.add(new Square(1, 6, cardColor));
        test();
    }

    /**
     * <b>Test the move to the Up Left square, the Left Down Square and the right arm edge
     * condition.</b>
     */
    @Test
    public void testGetPossibleMovementsUpLeft() {
        setCurrentSquare(3, 7);
        expResult.add(new Square(2, 5, cardColor));
        expResult.add(new Square(1, 6, cardColor));
        System.out.println(instance.getPossibleMovements(currentSquare));
        test();
    }

    @Test
    public void testGetPossibleMovementsDownLeft() {
        setCurrentSquare(1, 6);
        expResult.add(new Square(0, 8, cardColor));
        test();
    }

    @Test
    public void testGetPossibleMovementsDownRight() {
        setCurrentSquare(0, 4);
        expResult.add(new Square(1, 6, cardColor));
        expResult.add(new Square(2, 5, cardColor));
        test();
    }

    @Test
    public void testGetPossibleMovementsLeftEdge() {
        setCurrentSquare(0, 6);
        // This square is on the good arm.
        expResult.add(new Square(2, 5, cardColor));
        test();
    }

    @Test
    public void testGetPossibleMovementsWithOccupiedTemporarySquare() {
        setCurrentSquare(0, 8);
        board.getSquare(0, 6).setAsOccupied();
        expResult.add(new Square(1, 6, cardColor));
        test();
    }

    @Test
    public void testGetPossibleMovementsInCircle() {
        setCurrentSquare(4, 1);

        expResult.add(new Square(6, 2, cardColor));
        expResult.add(new Square(2, 2, cardColor));

        System.out.println(instance.getPossibleMovements(currentSquare));

        test();
    }

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new RiderCard(board, cardColor);
    }

}
