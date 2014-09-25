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
    public void testGetPossibleMovementsOnCircle() {
        System.out.println("getPossibleMovements: Circle");
        Board board = new Board();
        Square currentSquare = board.getSquare(0, 0);
        currentSquare.setAsOccupied();
        Color color = Color.YELLOW;
        WarriorCard instance = new WarriorCard(board, color);

        Set<Square> expResult = new HashSet<>();
        expResult.add(new Square(1, 0, color));
        expResult.add(new Square(31, 0, color));

        Set<Square> result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        // Test at the other edge of the board.
        System.out.println("getPossibleMovements: No diagonal");
        currentSquare.empty();
        currentSquare = board.getSquare(2, 8);
        currentSquare.setAsOccupied();
        expResult = new HashSet<>();
        expResult.add(new Square(2, 9, color));

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }

}
