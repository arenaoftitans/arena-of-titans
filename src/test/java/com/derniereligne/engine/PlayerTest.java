/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine;

import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.Deck;
import java.util.HashSet;
import java.util.Set;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

/**
 *
 * @author jenselme
 */
public class PlayerTest {

    private Player defaultPlayer;
    private GameFactory gameFactory;

    @Before
    public void init() {
        gameFactory = new GameFactory();
        defaultPlayer = new Player(null, 0);
        defaultPlayer.initGame(gameFactory.getBoard(), gameFactory.getDeckCreator());
    }

    @Test
    public void testMoveTo() {
        Square startSquare = defaultPlayer.getCurrentSquare();
        assertTrue(startSquare.isOccupied());
        assertEquals(0, startSquare.getX());
        assertEquals(8, startSquare.getY());

        Square newSquare = new Square(8, 0, Color.BLACK);
        defaultPlayer.moveTo(newSquare);
        Square currentSquare = defaultPlayer.getCurrentSquare();
        assertFalse(startSquare.isOccupied());
        assertTrue(currentSquare.isOccupied());
        assertNotEquals(startSquare, currentSquare);
        assertEquals(8, currentSquare.getX());
        assertEquals(0, currentSquare.getY());
    }

    @Test
    public void testWins() {
        defaultPlayer.wins(1);

        assertTrue(defaultPlayer.hasWon());
        assertTrue(defaultPlayer.isWinnerInMatch());
        assertEquals(1, defaultPlayer.getRank());
    }

    @Test
    public void testInitGamePlayerIndex0() {
        // Check that the 1st square is OK
        Square currentSquare = defaultPlayer.getCurrentSquare();
        assertTrue(currentSquare.isOccupied());
        assertEquals(0, currentSquare.getX());
        assertEquals(8, currentSquare.getY());

        // Check the deck
        Deck deck = defaultPlayer.getDeck();
        assertNotNull(deck);
        assertEquals(5, deck.getNumberCardsInHand());

        // Check that the player has not won
        assertFalse(defaultPlayer.hasWon());
        assertFalse(defaultPlayer.hasReachedItsAim());
        assertEquals(-1, defaultPlayer.getRank());

        // Check the aim
        Set<Integer> expectedAim = new HashSet<>();
        expectedAim.add(16);
        expectedAim.add(17);
        expectedAim.add(18);
        expectedAim.add(19);
        assertEquals(expectedAim, defaultPlayer.getAim());
    }

    @Test
    public void testInitGamePlayerIndex1() {
        defaultPlayer = new Player(null, 1);
        GameFactory gf = new GameFactory();
        defaultPlayer.initGame(gf.getBoard(), gf.getDeckCreator());
        // Check that the 1st square is OK
        Square currentSquare = defaultPlayer.getCurrentSquare();
        assertTrue(currentSquare.isOccupied());
        assertEquals(4, currentSquare.getX());
        assertEquals(8, currentSquare.getY());

        // Check the deck
        Deck deck = defaultPlayer.getDeck();
        assertNotNull(deck);
        assertEquals(5, deck.getNumberCardsInHand());

        // Check that the player has not won
        assertFalse(defaultPlayer.hasWon());
        assertFalse(defaultPlayer.hasReachedItsAim());
        assertEquals(-1, defaultPlayer.getRank());

        // Check the aim
        Set<Integer> expectedAim = new HashSet<>();
        expectedAim.add(20);
        expectedAim.add(21);
        expectedAim.add(22);
        expectedAim.add(23);
        assertEquals(expectedAim, defaultPlayer.getAim());
    }

    @Test
    public void testInitTurn() {
        defaultPlayer.canPlay(false);
        defaultPlayer.initTurn();
        assertTrue(defaultPlayer.canPlay());
        assertEquals(defaultPlayer.getCurrentSquare(), defaultPlayer.getLastSquare());
    }

    @Test
    public void testHasReachedItsAim() {
        defaultPlayer.play(gameFactory.getBoard(), null, 16, 8);
        defaultPlayer.initTurn();
        defaultPlayer.pass();
        assertTrue(defaultPlayer.hasReachedItsAim());
    }

    @Test
    public void testPlay() {
        Square previousSquare = defaultPlayer.getCurrentSquare();
        defaultPlayer.play(gameFactory.getBoard(), null, 0, 0);
        Square currentSquare = defaultPlayer.getCurrentSquare();
        assertFalse(previousSquare.isOccupied());
        assertTrue(currentSquare.isOccupied());
        assertNotEquals(previousSquare, currentSquare);
        assertEquals(0, currentSquare.getX());
        assertEquals(0, currentSquare.getY());
    }

    @Test
    public void testPass() {
        defaultPlayer.pass();
        assertFalse(defaultPlayer.canPlay());
    }

}
