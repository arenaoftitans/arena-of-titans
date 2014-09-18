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
public class WarriorCardTest {

    public WarriorCardTest() {
    }

    /**
     * Test of getPossibleMovements method, of class WarriorCard.
     */
    @Test
    public void testGetPossibleMovements() {
        System.out.println("getPossibleMovements");
        Board board = new Board();
        Square currentSquare = board.getSquare(0, 0);
        currentSquare.setAsOccupied();
        WarriorCard instance = new WarriorCard(board, Color.WHITE);

        Set<Square> expResult = new HashSet<>();
        expResult.add(new Square(0, 1, Color.VOID));
        expResult.add(new Square(0, 2, Color.VOID));
        expResult.add(new Square(1, 1, Color.VOID));
        expResult.add(new Square(9, 0, Color.VOID));
        expResult.add(new Square(8, 0, Color.VOID));
        expResult.add(new Square(7, 0, Color.VOID));

        Set<Square> result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        // Test at the other edge of the board.
        System.out.println("getPossibleMovements");
        currentSquare.empty();
        currentSquare = board.getSquare(9, 0);
        currentSquare.setAsOccupied();
        expResult = new HashSet<>();
        expResult.add(new Square(0, 0, Color.VOID));
        expResult.add(new Square(0, 1, Color.VOID));
        expResult.add(new Square(0, 2, Color.VOID));
        expResult.add(new Square(1, 1, Color.VOID));
        expResult.add(new Square(8, 0, Color.VOID));
        expResult.add(new Square(7, 0, Color.VOID));

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }

}
