/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dernierelignegameengine;

import java.util.HashSet;
import java.util.Set;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author jenselme
 */
public class QueenCardTest {

    public QueenCardTest() {
    }

    /**
     * Test of getPossibleMovements method, of class QueenCard.
     */
    @Test
    public void testGetPossibleMovements() {
        System.out.println("getPossibleMovements");
        Board board = new Board();
        Square currentSquare = board.getSquare(0, 0);
        currentSquare.setAsOccupied();
        QueenCard instance = new QueenCard(board, Color.WHITE);

        Set<Square> expResult = new HashSet<>();
        expResult.add(new Square(0, 1, Color.WHITE));
        expResult.add(new Square(0, 2, Color.WHITE));
        expResult.add(new Square(1, 1, Color.WHITE));
        expResult.add(new Square(7, 0, Color.WHITE));
        expResult.add(new Square(6, 0, Color.WHITE));
        expResult.add(new Square(6, 1, Color.WHITE));

        Set<Square> result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        // On the other edge of the board.
        System.out.println("getPossibleMovements");
        currentSquare.empty();
        currentSquare = board.getSquare(7, 0);
        currentSquare.setAsOccupied();

        expResult = new HashSet<>();
        expResult.add(new Square(0, 0, Color.WHITE));
        expResult.add(new Square(0, 1, Color.WHITE));
        expResult.add(new Square(0, 2, Color.WHITE));
        expResult.add(new Square(1, 1, Color.WHITE));
        expResult.add(new Square(0, 2, Color.WHITE));
        expResult.add(new Square(6, 0, Color.WHITE));
        expResult.add(new Square(6, 1, Color.WHITE));
        expResult.add(new Square(6, 2, Color.WHITE));
        expResult.add(new Square(5, 0, Color.WHITE));

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }

}
