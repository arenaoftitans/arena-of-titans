package com.derniereligne.engine;

import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.cards.movements.LineAndDiagonalMovementsCard;
import com.derniereligne.engine.cards.movements.MovementsCard;
import com.derniereligne.engine.cards.trumps.ModifyNumberOfMovesInATurnTrump;
import com.derniereligne.engine.cards.trumps.Trump;
import java.util.ArrayList;
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
        match = new Match(players, board, gf.getDeckCreator(), new ArrayList<>());
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
        match.playTurn(16, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Still in the same Turn
        match.playTurn(16, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Play the others players
        for (int i = 0; i <= 7; i++) {
            match.playTurn(0, i, null);
            match.playTurn(i, 0, null);
        }

        Player winner = match.getPlayers().get(0);
        // The winner cannot be an active player
        assertNotEquals(match.getActivePlayer(), winner);
        assertFalse(match.getGameOver());
        assertTrue(winner.hasWon());
        assertEquals(1, winner.getRank());
    }

    @Test
    public void testPlayTurnForWinningPlayerPassSecondMove() {
        match.playTurn(16, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Still in the same Turn
        match.passThisTurn();
        assertFalse(match.getPlayers().get(0).hasWon());

        // Play the others players
        for (int i = 0; i <= 7; i++) {
            match.playTurn(0, i, null);
            match.playTurn(i, 0, null);
        }

        Player winner = match.getPlayers().get(0);
        // The winner cannot be an active player
        assertNotEquals(match.getActivePlayer(), winner);
        assertTrue(winner.hasWon());
        assertEquals(1, winner.getRank());
    }

    @Test
    public void testPlayTurnForWinningPlayerMoveDifferentSquareSecondMove() {
        match.playTurn(16, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Still in the same Turn
        match.playTurn(17, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Play the others players
        for (int i = 0; i <= 7; i++) {
            match.playTurn(0, i, null);
            match.playTurn(i, 0, null);
        }

        Player winner = match.getPlayers().get(0);
        // The winner cannot be an active player
        assertNotEquals(match.getActivePlayer(), winner);
        assertTrue(winner.hasWon());
        assertEquals(1, winner.getRank());
    }

    @Test
    public void testPlayTurnForPlayerMovingBeforeWinning() {
        match.playTurn(17, 8, null);

        assertFalse(match.getPlayers().get(0).isWinnerInMatch());
    }

    @Test
    public void testPlayTurnForEndOfGame() {
        for (int i = 2; i <= 7; i++) {
            match.getPlayers().set(i, null);
        }

        // We play player 1.
        match.playTurn(16, 8, null);
        match.playTurn(16, 8, null);

        // We play player 2 so it is back at player 1, who wins. The match ends.
        match.playTurn(0, 0, null);
        match.playTurn(0, 0, null);

        assertEquals(null, match.playTurn(16, 8, null));
        assertTrue(match.getPlayers().get(0).hasWon());
        assertTrue(match.getGameOver());
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
        match.passThisTurn();
        assertNotEquals(match.getActivePlayer(), currentPlayer);
    }

    @Test
    public void testPlayTrumpCard() {
        Player player1 = match.getPlayers().get(0);
        Player player2 = match.getPlayers().get(1);
        Player player3 = match.getPlayers().get(2);

        Trump trumpCard = new ModifyNumberOfMovesInATurnTrump(null, 1, null, 0, 2);
        player1.addTrumpCardToPlayable(trumpCard);

        assertEquals(match.getActivePlayer(), player1);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player1);
        match.playTrumpCard(player2, trumpCard);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player3);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player3);
    }

}
