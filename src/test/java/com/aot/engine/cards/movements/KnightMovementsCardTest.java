package com.aot.engine.cards.movements;

import com.aot.engine.Color;
import org.junit.Test;

/**
 * <b>Test class for KnightMovementsCard.</b>

 Test specific movement for the KnightMovementsCard.
 *
 * @author "Arena of Titans" first development team
 */
public class KnightMovementsCardTest extends MovementsCardTest {

    public KnightMovementsCardTest() {
    }

    @Test
    public void testGetPossibleMovementsNoMovement() {
        setCurrentSquare(3, 8);

        test();
    }

    @Test
    public void testGetPossibleMovementsUpRight() {
        setCurrentSquare(0, 8);
        expResult.add("square-1-6");
        test();
    }

    /**
     * <b>Test the move to the Up Left square, the Left Down Square and the right arm edge
     * condition.</b>
     */
    @Test
    public void testGetPossibleMovementsUpLeft() {
        setCurrentSquare(3, 7);
        expResult.add("square-2-5");
        expResult.add("square-1-6");
        test();
    }

    @Test
    public void testGetPossibleMovementsDownLeft() {
        setCurrentSquare(1, 6);
        expResult.add("square-0-8");
        test();
    }

    @Test
    public void testGetPossibleMovementsDownRight() {
        setCurrentSquare(0, 4);
        expResult.add("square-1-6");
        expResult.add("square-2-5");
        test();
    }

    @Test
    public void testGetPossibleMovementsLeftEdge() {
        setCurrentSquare(0, 6);
        // This square is on the good arm.
        expResult.add("square-2-5");
        test();
    }

    @Test
    public void testGetPossibleMovementsWithOccupiedTemporarySquare() {
        setCurrentSquare(0, 8);
        board.getSquare(0, 6).setAsOccupied();
        expResult.add("square-1-6");
        test();
    }

    @Test
    public void testGetPossibleMovementsInCircle() {
        setCurrentSquare(4, 1);

        expResult.add("square-6-2");
        expResult.add("square-2-2");

        test();
    }

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new KnightMovementsCard(board, null, 1, cardColor);
    }

}
