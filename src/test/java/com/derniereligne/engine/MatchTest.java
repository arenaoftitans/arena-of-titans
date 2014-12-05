package com.derniereligne.engine;

import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.cards.movements.LineAndDiagonalMovementsCard;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.HashSet;
import java.util.Set;
import org.junit.After;
import static org.junit.Assert.assertNotEquals;
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
        GameFactory gf = new GameFactory();
        board = gf.getBoard();
        Player[] players = new Player[8];
        for (int i = 0; i < 8; i++) {
            players[i] = new Player("player " + i, i);
        }
        match = new Match(players, board, gf.getDeckCreator());
    }

    @After
    public void tearDown() {
        match = null;
    }

    @Test
    public void testPlayTurnIfOnlyOnePlayer() {
        for (int i = 1; i <= 7; i++) {
            match.getPlayers().set(i, null);
        }
        assertEquals(match.playTurn(defaultX, defaultY, null), null);
    }

    @Test
    public void testPlayTurnForWinningPlayer() {
        match.getActivePlayer().moveTo(board.getSquare(16, 8));
        match.playTurn(16, 8, null);

        assertTrue(match.getPlayers().get(0).isWinnerInMatch());
    }

    @Test
    public void testPlayTurnForPlayerMovingBeforeWinning() {
        match.getActivePlayer().moveTo(board.getSquare(16, 8));
        match.playTurn(17, 8, null);

        assertFalse(match.getPlayers().get(0).isWinnerInMatch());
    }

    @Test
    public void testPlayTurnForEndOfGame() {
        for (int i = 2; i <= 7; i++) {
            match.getPlayers().set(i, null);
        }

        match.getActivePlayer().moveTo(board.getSquare(16, 8));
        assertEquals(match.playTurn(16, 8, null), null);
    }

    @Test
    public void testPlayTurnFirstPlayerPlayingInFullGame() {
        match.playTurn(defaultX, defaultY, null);
        assertEquals(match.playTurn(defaultX, defaultY, null), match.getPlayers().get(1));
    }

    @Test
    public void testPlayTurnForLastPlayerInFullGame() {
        // Players play twice !
        for (int i = 0; i <= 14; i++) {
            match.playTurn(defaultX, defaultY, null);
        }

        assertEquals(match.playTurn(defaultX, defaultY, null), match.getPlayers().get(0));
    }

    @Test
    public void testPlayTurnForFirstPlayerInPartialGame() {
        match.getPlayers().set(1, null);
        match.playTurn(defaultX, defaultY, null);

        assertEquals(match.playTurn(defaultX, defaultY, null), match.getPlayers().get(2));
    }

    @Test
    public void testPlayTurnForLastPlayerInPartialGame() {
        for (int i = 0; i <= 6; i++) {
            match.playTurn(defaultX, defaultY, null);
        }
        for (int i = 0; i <= 5; i++) {
            match.getPlayers().set(i, null);
        }
        assertEquals(match.playTurn(defaultX, defaultY, null), match.getPlayers().get(6));
    }

    @Test
    public void testGetPossibleMovementsFirstMoveFirstPlayer() {
        MovementsCard card = new LineAndDiagonalMovementsCard(board, null, 2, Color.RED);
        Set<String> possibleMovements = card.getPossibleMovements(match.getActivePlayerCurrentSquare());
        Set<String> expResult = new HashSet<>();
        expResult.add("square-0-7");
        expResult.add("square-1-6");

        assertEquals(expResult, possibleMovements);
    }

    @Test
    public void testPassThisTurn() {
        Player currentPlayer = match.getActivePlayer();
        System.out.println(match.passThisTurn());
        assertNotEquals(match.getActivePlayer(), currentPlayer);
    }

}
