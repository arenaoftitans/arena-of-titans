package com.derniereligne.engine.cards;

import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.cards.RiderCard;
import com.derniereligne.engine.Color;
import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import java.util.HashSet;
import java.util.Set;
import org.junit.Test;
import static org.junit.Assert.*;

public class RiderCardTest {

    public RiderCardTest() {
    }

    @Test
    public void testGetPossibleMovements() {
        System.out.println("getPossibleMovements");
        Board board = new Board("test_board");
        Square currentSquare = board.getSquare(0, 9);
        currentSquare.setAsOccupied();
        Color color = Color.RED;
        RiderCard instance = new RiderCard(board, color);

        Set<Square> expResult = new HashSet<>();
        expResult.add(new Square(1, 7, color));

        Set<Square> result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        System.out.println("getPossibleMovements: no movement");
        color = Color.BLUE;
        instance = new RiderCard(board, color);
        currentSquare.empty();
        currentSquare = board.getSquare(3, 9);
        currentSquare.setAsOccupied();

        expResult = new HashSet<>();

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        System.out.println("getPossibleMovements: down");
        color = Color.BLUE;
        instance = new RiderCard(board, color);
        currentSquare.empty();
        currentSquare = board.getSquare(3, 3);
        currentSquare.setAsOccupied();

        expResult = new HashSet<>();
        expResult.add(new Square(2, 5, color));

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }

}
