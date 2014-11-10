package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import java.util.HashSet;
import java.util.Set;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

public class SquareTest {

    private Square square;

    @Before
    public void initSquare() {
        square = new Square(0, 8, Color.RED);
    }

    @Test
    public void testCanMoveTo() {
        Set<Color> possibleColors = new HashSet<>();
        possibleColors.add(Color.RED);
        possibleColors.add(Color.BLACK);

        assertTrue(square.canMoveTo(possibleColors));
    }

    @Test
    public void testCanMoveToWhite() {
        Set<Color> possibleColors = new HashSet<>();
        possibleColors.add(Color.WHITE);

        assertTrue(square.canMoveTo(possibleColors));
    }

    @Test
    public void testCanNotMoveTo() {
        Set<Color> possibleColors = new HashSet<>();
        possibleColors.add(Color.BLACK);
        possibleColors.add(Color.BLUE);

        assertFalse(square.canMoveTo(possibleColors));
    }

    @Test
    public void testGetId() {
        assertEquals("0-8", square.getId());
    }

    @Test
    public void testGetCssId() {
        assertEquals("#0-8", square.getCssId());
    }

}
