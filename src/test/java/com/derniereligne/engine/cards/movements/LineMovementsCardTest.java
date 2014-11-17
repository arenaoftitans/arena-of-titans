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
public class LineMovementsCardTest extends MovementsCardTest {

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new LineMovementsCard(board, null, 3, cardColor);
    }

    @Test
    public void testGetPossibleMovementsOneMove() {
        instance = new LineMovementsCard(board, null, 1, cardColor);
        setCurrentSquare(0, 8);

        expResult.add(new Square(0, 7, cardColor));

        test();
    }

    @Test
    public void testGetPossibleMovementsOneMoveOnCircle() {
        instance = new LineMovementsCard(board, null, 1, cardColor);
        setCurrentSquare(2, 1);

        expResult.add(new Square(2, 2, cardColor));
        expResult.add(new Square(3, 1, cardColor));

        test();
    }

    @Test
    public void testGetPossibleMovementsOnCircle() {
        setCurrentSquare(2, 1);

        expResult.add(new Square(3, 1, cardColor));
        expResult.add(new Square(4, 1, cardColor));
        expResult.add(new Square(5, 1, cardColor));
        expResult.add(new Square(2, 2, cardColor));

        test();
    }

    @Test
    public void testGetPossibleMovementsNoDiagonal() {
        setCurrentSquare(0, 8);
        currentSquare.empty();

        expResult.add(new Square(0, 7, cardColor));
        expResult.add(new Square(0, 8, cardColor)); // This square is empty, so we can move there.

        test();
    }

}
