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
        System.out.println("getPossibleMovements");
        Board board = new Board();
        Square currentSquare = board.getSquare(0, 0);
        currentSquare.setAsOccupied();
        WarriorCard instance = new WarriorCard(board, Color.WHITE);

        Set<Square> expResult = new HashSet<>();
        expResult.add(new Square(0, 1, Color.WHITE));
        expResult.add(new Square(7, 0, Color.WHITE));

        Set<Square> result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        // Test at the other edge of the board.
        System.out.println("getPossibleMovements");
        currentSquare.empty();
        currentSquare = board.getSquare(7, 0);
        currentSquare.setAsOccupied();
        expResult = new HashSet<>();
        expResult.add(new Square(0, 0, Color.WHITE));
        expResult.add(new Square(6, 0, Color.WHITE));

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }

    @Test
    public void testGetPossibleMovementsInArm() {
        System.out.println("getPossibleMovements");
        Board board = new Board();
        Square currentSquare = board.getSquare(0, 1);
        currentSquare.setAsOccupied();
        WarriorCard instance = new WarriorCard(board, Color.WHITE);

        Set<Square> expResult = new HashSet<>();
        expResult.add(new Square(0, 0, Color.WHITE));
        expResult.add(new Square(0, 2, Color.WHITE));
        expResult.add(new Square(1, 1, Color.WHITE));

        Set<Square> result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);

        currentSquare.empty();
        currentSquare = board.getSquare(2, 1);
        currentSquare.setAsOccupied();
        expResult = new HashSet<>();
        expResult.add(new Square(2, 2, Color.WHITE));

        result = instance.getPossibleMovements(currentSquare);
        assertEquals(expResult, result);
    }

}
