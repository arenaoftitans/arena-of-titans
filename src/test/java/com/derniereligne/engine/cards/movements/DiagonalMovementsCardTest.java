/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards.movements;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import static com.derniereligne.engine.cards.movements.MovementsCardTest.cardColor;
import java.util.Arrays;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author jenselme
 */
public class DiagonalMovementsCardTest extends MovementsCardTest {

    @Override
    public void initCard() {
        cardColor = Color.RED;
        Color[] complementaryColors = {Color.BLACK};
        instance = new DiagonalMovementsCard(board, null, 2, cardColor, Arrays.asList(complementaryColors));
    }

    @Test
    public void testGetPossibleMovements() {
        setCurrentSquare(31, 2);

        expResult.add(new Square(0, 3, Color.BLACK));
        expResult.add(new Square(1, 2, Color.BLACK));

        test();
    }

}
