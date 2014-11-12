package com.derniereligne.engine;

import com.derniereligne.engine.board.Board;
import org.junit.After;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class MatchTest {
    private Match match;

    private Board board;
    private final int defaultX = 0;
    private final int defaultY = 0;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before
    public void setUp() {
        board = new Board();
        Player[] players = new Player[8];
        for (int i = 0; i < 8; i++)
            players[i] = new Player("player " + i);
        match = new Match(players, board);
    }

    @After
    public void tearDown() {
        match = null;
    }

    @Test
    public void testPlayTurnIfOnlyOnePlayer() {
        for (int i = 1; i <=7; i++) {
            match.getPlayers()[i] = null;
        }
        assertEquals(match.playTurn(defaultX, defaultY), null);
    }

    @Test
    public void testPlayTurnForWinningPlayer() {
        match.getActivePlayer().moveTo(board.getSquare(16, 8));
        match.playTurn(16, 8);

        assertTrue(match.getPlayers()[0].isWinnerInMatch());
    }

    @Test
    public void testPlayTurnForPlayerMovingBeforeWinning() {
        match.getActivePlayer().moveTo(board.getSquare(16, 8));
        match.playTurn(17, 8);

        assertFalse(match.getPlayers()[0].isWinnerInMatch());
    }

    @Test
    public void testPlayTurnForEndOfGame() {
        for (int i = 2; i <= 7; i++) {
            match.getPlayers()[i] = null;
        }

        match.getActivePlayer().moveTo(board.getSquare(16, 8));
        assertEquals(match.playTurn(16, 8), null);
    }

    @Test
    public void testPlayTurnFirstPlayerPlayingInFullGame() {
        assertEquals(match.playTurn(defaultX, defaultY), match.getPlayers()[1]);
    }

    @Test
    public void testPlayTurnForLastPlayerInFullGame() {
        for (int i = 0; i <=6; i++) {
            match.playTurn(defaultX, defaultY);
        }

        assertEquals(match.playTurn(defaultX, defaultY), match.getPlayers()[0]);
    }

    @Test
    public void testPlayTurnForFirstPlayerInPartialGame() {
        match.getPlayers()[1] = null;

        assertEquals(match.playTurn(defaultX, defaultY), match.getPlayers()[2]);
    }

    @Test
    public void testPlayTurnForLastPlayerInPartialGame() {
        for (int i = 0; i <=6; i++) {
            match.playTurn(defaultX, defaultY);
        }
        for (int i = 0; i <= 5; i++) {
            match.getPlayers()[i] = null;
        }
        assertEquals(match.playTurn(defaultX, defaultY), match.getPlayers()[6]);
    }

}
