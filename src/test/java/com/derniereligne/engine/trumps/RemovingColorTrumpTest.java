package com.derniereligne.engine.trumps;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.Match;
import com.derniereligne.engine.Player;
import com.derniereligne.engine.board.Board;
import java.util.ArrayList;
import java.util.List;
import org.junit.After;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import org.junit.Before;
import org.junit.Test;

public class RemovingColorTrumpTest {
    Match match;

    @Before
    public void setUp() {
        GameFactory gf = new GameFactory();
        Board board = gf.getBoard();

        Player player1 = new Player("player1", 0);
        Player player2 = new Player("player2", 1);
        List<Player> players = new ArrayList<>();
        players.add(player1);
        players.add(player2);

        match = new Match(players, gf.getBoard(), gf.getDeckCreator(), new ArrayList<>());
    }

    @After
    public void tearDown() {
        match = null;
    }

    @Test
    public void testRemovingColor() {
        Player activePlayer = match.getActivePlayer();
        assertNotNull(activePlayer);
        assertNotNull(activePlayer.getDeck());
        assertNotNull(activePlayer.getDeck().getFirstCardInHand());
        assertNotNull(activePlayer.getDeck().getFirstCardInHand().getSquarePossibleColors());
        Color color = activePlayer.getDeck().getFirstCardInHand().getSquarePossibleColors().iterator().next();
        Trump trump = new RemovingColorTrump("Remove", 1, null, 0, false, color);
        trump.affect(activePlayer);
        assertFalse(activePlayer.getDeck().getFirstCardInHand().getSquarePossibleColors().contains(color));
    }

    @Test
    public void testRemovingAll() {
        Player activePlayer = match.getActivePlayer();
        Trump trump = new RemovingColorTrump("Remove", 1, null, 0, false, Color.ALL);
        trump.affect(activePlayer);
        assertEquals(0, activePlayer.getDeck().getFirstCardInHand().getSquarePossibleColors().size());
    }
}
