package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import java.util.HashSet;
import java.util.Set;
import org.junit.After;
import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.BeforeClass;

/**
 * <b>Provides common attributes and methods to test cards.</b>
 *
 * @author "Dernière Ligne" first development team
 */
public abstract class CardTest {

    protected static Board board;
    protected static Card instance;
    protected static Color cardColor;
    protected Square currentSquare;
    protected Set<Square> expResult;
    protected Set<Square> result;

    @BeforeClass
    public static void initBoard() {
        board = new Board();
    }

    @Before
    public void initExpectedResult() {
        expResult = new HashSet<>();
        result = new HashSet<>();
    }

    @Before
    public abstract void initCard();

    @After
    public void emptySquare() {
        currentSquare.empty();
    }

    public void setCurrentSquare(int x, int y) {
        currentSquare = board.getSquare(x, y);
        currentSquare.setAsOccupied();
    }

    public void test() {
        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }
}
