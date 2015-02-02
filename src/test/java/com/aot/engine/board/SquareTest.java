package com.aot.engine.board;

import com.aot.engine.board.Square;
import com.aot.engine.Color;
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
        possibleColors.add(Color.ALL);

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
        assertEquals("square-0-8", square.getId());
    }

}