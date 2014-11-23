/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards.movements;

import com.derniereligne.engine.Color;
import static com.derniereligne.engine.cards.movements.MovementsCardTest.cardColor;
import java.util.Arrays;
import org.junit.Test;

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

        expResult.add("#0-3");
        expResult.add("#1-2");

        test();
    }

    @Test
    public void testGetPossibleMovementsStart() {
        setCurrentSquare(0, 8);

        test();
    }

    @Test
    public void testGetPossibleMovementsNoMovement() {
        instance = new DiagonalMovementsCard(board, null, 1, cardColor);
        setCurrentSquare(0, 8);
        test();
    }

}
