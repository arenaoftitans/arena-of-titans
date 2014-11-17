/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards.movements;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import static com.derniereligne.engine.cards.movements.MovementsCardTest.cardColor;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author jenselme
 */
public class LineAndDiagonalMovementsCardTest extends MovementsCardTest {

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new LineAndDiagonalMovementsCard(board, null, 2, cardColor);
    }

    @Test
    public void getPossibleMovementsOneMove() {
        // The default instance has 2 moves.
        instance = new LineAndDiagonalMovementsCard(board, null, 1, cardColor);
        setCurrentSquare(0, 8);
        expResult.add(new Square(0, 7, cardColor));

        test();
    }

    @Test
    public void testGetPossibleMovementsTwoMoves() {
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
