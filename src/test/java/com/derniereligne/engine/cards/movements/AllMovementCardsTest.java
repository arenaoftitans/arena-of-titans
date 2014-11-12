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
        expResult.add(new Square(0, 7, Color.RED));
        expResult.add(new Square(1, 7, Color.BLUE));
        expResult.add(new Square(1, 8, Color.BLUE));

        test();
    }

    @Test
    public void getPossibleMovementsLeftEgde() {
        setCurrentSquare(4, 5);
        expResult.add(new Square(4, 4, Color.BLACK));
        expResult.add(new Square(5, 4, Color.YELLOW));
        expResult.add(new Square(5, 5, Color.BLACK));
        expResult.add(new Square(5, 6, Color.RED));
        expResult.add(new Square(4, 6, Color.BLUE));
        test();
    }

    @Test
    public void getPossibleMovementsRightEdgeBottom() {
        setCurrentSquare(3, 8);
        expResult.add(new Square(2, 8, Color.YELLOW));
        expResult.add(new Square(2, 7, Color.YELLOW));
        expResult.add(new Square(3, 7, Color.BLACK));
        test();
    }

    @Test
    public void getPossibleMovementsRightEdge() {
        setCurrentSquare(7, 5);
        expResult.add(new Square(7, 6, Color.YELLOW));
        expResult.add(new Square(6, 6, Color.BLACK));
        expResult.add(new Square(6, 5, Color.RED));
        expResult.add(new Square(6, 4, Color.BLUE));
        expResult.add(new Square(7, 4, Color.RED));
        test();
    }

    @Test
    public void getPossibleMovementsLeftEdgeCircle() {
        setCurrentSquare(0, 1);
        expResult.add(new Square(0, 0, Color.YELLOW));
        expResult.add(new Square(1, 0, Color.YELLOW));
        expResult.add(new Square(1, 1, Color.BLUE));
        expResult.add(new Square(1, 2, Color.BLACK));
        expResult.add(new Square(0, 2, Color.BLUE));
        expResult.add(new Square(31, 2, Color.YELLOW));
        expResult.add(new Square(31, 1, Color.BLUE));
        expResult.add(new Square(31, 0, Color.YELLOW));
        test();
    }

    @Test
    public void getPossibleMovementsRightEdgeCircle() {
        setCurrentSquare(7, 1);
        expResult.add(new Square(7, 0, Color.YELLOW));
        expResult.add(new Square(8, 0, Color.YELLOW));
        expResult.add(new Square(8, 1, Color.BLUE));
        expResult.add(new Square(8, 2, Color.BLUE));
        expResult.add(new Square(7, 2, Color.YELLOW));
        expResult.add(new Square(6, 2, Color.RED));
        expResult.add(new Square(6, 1, Color.BLUE));
        expResult.add(new Square(6, 0, Color.YELLOW));
        test();
    }

    @Test
    public void getPossibleMovementsOverACardInDiagonal() {
        // Set the position of the Wizard which will hinder the movement.
        setCurrentSquare(1, 6);

        Color[] additionnalColors = {Color.BLACK};
        MovementsCard cardToPlay = new DiagonalMovementsCard(board, null, 2, cardColor, Arrays.asList(additionnalColors));
        setStartSquare(0, 7);

        expResult.add(new Square(2, 5, cardColor));
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

        expResult.add(new Square(1, 6, cardColor));
        expResult.add(new Square(0, 8, cardColor));
        result = cardToPlay.getPossibleMovements(startSquare);
        assertEquals(expResult, result);
    }

    @Test
    public void getPossibleMovementsOverACardInLineAndDiagonalTestLine() {
        // Set the position of the Wizard which will hinder the movement.
        setCurrentSquare(0, 7);

        MovementsCard cardToPlay = new LineAndDiagonalMovementsCard(board, null, 2, cardColor);
        setStartSquare(0, 6);

        expResult.add(new Square(1, 6, cardColor));
        expResult.add(new Square(0, 8, cardColor));
        expResult.add(new Square(2, 5, cardColor));
        result = cardToPlay.getPossibleMovements(startSquare);
        assertEquals(expResult, result);
    }

    @Test
    public void getPossibleMovementsOverACardInLineAndDiagonalTestDiagonal() {
        setCurrentSquare(1, 6);

        MovementsCard cardToPlay = new LineAndDiagonalMovementsCard(board, null, 2, cardColor);
        setStartSquare(0, 7);

        expResult.add(new Square(2, 5, cardColor));
        expResult.add(new Square(0, 8, cardColor));
        result = cardToPlay.getPossibleMovements(startSquare);
        assertEquals(expResult, result);
    }

}
