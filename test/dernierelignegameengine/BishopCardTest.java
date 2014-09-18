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
public class BishopCardTest {

    public BishopCardTest() {
    }

    /**
     * Test of getPossibleMovements method, of class BishopCard.
     */
    @Test
    public void testGetPossibleMovements() {
        System.out.println("getPossibleMovements");
        Board board = new Board();
        Square currentSquare = board.getSquare(0, 0);
        currentSquare.setAsOccupied();
        BishopCard instance = new BishopCard(board, Color.WHITE);

        Set<Square> expResult = new HashSet<>();
        expResult.add(new Square(2, 0, Color.VOID));
        expResult.add(new Square(0, 2, Color.VOID));
        expResult.add(new Square(1, 1, Color.VOID));

        Set<Square> result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        // On the other edge.
        System.out.println("getPossibleMovements");
        currentSquare.empty();
        currentSquare = board.getSquare(9, 0);
        currentSquare.setAsOccupied();

        expResult = new HashSet<>();
        expResult.add(new Square(0, 1, Color.VOID));

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }

}
