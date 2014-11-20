package com.derniereligne.engine.cards.movements;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import java.util.Arrays;
import org.junit.After;
import static org.junit.Assert.assertEquals;
import org.junit.Test;

/**
 * <b>Test useful for all cards</b>
 *
 * This class test :
 * <ul>
 * <li>Edge movements in arms</li>
 * <li>Edge movements in the circle</li>
 * </ul>
 * All tests are done with a wizard so colors don't infer with the test.
 *
 * @author "Dernière Ligne" first development team
 */
public class AllMovementCardsTest extends MovementsCardTest {

    public Square startSquare;

    @Override
    public void initCard() {
        cardColor = Color.RED;
        Color[] additionnalColors = {Color.ALL};
        instance = new LineAndDiagonalMovementsCard(board, null, 1, cardColor, Arrays.asList(additionnalColors));
    }

    @After
    public void emptyStartSquare() {
        if (startSquare != null) {
            startSquare.empty();
        }
    }

    @Test
    public void getPossibleMovementsLeftEdgeFromBottom() {
        setCurrentSquare(0, 8);
        expResult.add("#0-7");
        expResult.add("#1-7");
        expResult.add("#1-8");

        test();
    }

    @Test
    public void getPossibleMovementsLeftEgde() {
        setCurrentSquare(4, 5);
        expResult.add("#4-4");
        expResult.add("#5-4");
        expResult.add("#5-5");
        expResult.add("#5-6");
        expResult.add("#4-6");
        test();
    }

    @Test
    public void getPossibleMovementsRightEdgeBottom() {
        setCurrentSquare(3, 8);
        expResult.add("#2-8");
        expResult.add("#2-7");
        expResult.add("#3-7");
        test();
    }

    @Test
    public void getPossibleMovementsRightEdge() {
        setCurrentSquare(7, 5);
        expResult.add("#7-6");
        expResult.add("#6-6");
        expResult.add("#6-5");
        expResult.add("#6-4");
        expResult.add("#7-4");
        test();
    }

    @Test
    public void getPossibleMovementsLeftEdgeCircle() {
        setCurrentSquare(0, 1);
        expResult.add("#0-0");
        expResult.add("#1-0");
        expResult.add("#1-1");
        expResult.add("#1-2");
        expResult.add("#0-2");
        expResult.add("#31-2");
        expResult.add("#31-1");
        expResult.add("#31-0");
        test();
    }

    @Test
    public void getPossibleMovementsRightEdgeCircle() {
        setCurrentSquare(7, 1);
        expResult.add("#7-0");
        expResult.add("#8-0");
        expResult.add("#8-1");
        expResult.add("#8-2");
        expResult.add("#7-2");
        expResult.add("#6-2");
        expResult.add("#6-1");
        expResult.add("#6-0");
        test();
    }

    @Test
    public void getPossibleMovementsOverACardInDiagonal() {
        // Set the position of the Wizard which will hinder the movement.
        setCurrentSquare(1, 6);

        Color[] additionnalColors = {Color.BLACK};
        MovementsCard cardToPlay = new DiagonalMovementsCard(board, null, 2, cardColor, Arrays.asList(additionnalColors));
        setStartSquare(0, 7);

        expResult.add("#2-5");
        result = cardToPlay.getPossibleMovements(startSquare);
        assertEquals(expResult, result);
    }

    public void setStartSquare(int x, int y) {
        startSquare = board.getSquare(x, y);
        startSquare.setAsOccupied();
    }

    @Test
    public void getPossibleMovementsOverACardInLine() {
        // Set the position of the Wizard which will hinder the movement.
        setCurrentSquare(0, 7);

        MovementsCard cardToPlay = new LineMovementsCard(board, null, 3, cardColor);
        setStartSquare(0, 6);

        expResult.add("#1-6");
        expResult.add("#0-8");
        result = cardToPlay.getPossibleMovements(startSquare);
        assertEquals(expResult, result);
    }

    @Test
    public void getPossibleMovementsOverACardInLineAndDiagonalTestLine() {
        // Set the position of the Wizard which will hinder the movement.
        setCurrentSquare(0, 7);

        MovementsCard cardToPlay = new LineAndDiagonalMovementsCard(board, null, 2, cardColor);
        setStartSquare(0, 6);

        expResult.add("#1-6");
        expResult.add("#0-8");
        expResult.add("#2-5");
        result = cardToPlay.getPossibleMovements(startSquare);
        assertEquals(expResult, result);
    }

    @Test
    public void getPossibleMovementsOverACardInLineAndDiagonalTestDiagonal() {
        setCurrentSquare(1, 6);

        MovementsCard cardToPlay = new LineAndDiagonalMovementsCard(board, null, 2, cardColor);
        setStartSquare(0, 7);

        expResult.add("#2-5");
        expResult.add("#0-8");
        result = cardToPlay.getPossibleMovements(startSquare);
        assertEquals(expResult, result);
    }

}
