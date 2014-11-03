package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import org.junit.Test;

/**
 * <b>Test useful for all cards</b>
 *
 * This class test :
 * <ul>
 *  <li>Edge movements in arms</li>
 *  <li>Edge movements in the circle</li>
 * </ul>
 * All tests are done with a wizard so colors don't infer with the test.
 *
 * @author "Dernière Ligne" first development team
 */
public class AllCardsTest extends CardTest {

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
        expResult.add(new Square(4, 4, Color.BLACK));//
        expResult.add(new Square(5, 4, Color.YELLOW));//
        expResult.add(new Square(5, 5, Color.BLACK));//
        expResult.add(new Square(5, 6, Color.RED));//
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

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new WizardCard(board, cardColor);
    }

}
