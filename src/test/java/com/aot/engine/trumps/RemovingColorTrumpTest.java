package com.aot.engine.trumps;

import com.aot.engine.Color;
import com.aot.engine.GameFactory;
import com.aot.engine.Match;
import com.aot.engine.Player;
import com.aot.engine.board.Board;
import com.aot.engine.board.Square;
import com.aot.engine.cards.Deck;
import com.aot.engine.cards.movements.KnightMovementsCard;
import com.aot.engine.cards.movements.LineAndDiagonalMovementsCard;
import com.aot.engine.cards.movements.MovementsCard;
import java.util.ArrayList;
import java.util.List;
import org.junit.After;
import org.junit.Assert;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import org.junit.Before;
import org.junit.Test;

public class RemovingColorTrumpTest {

    Match match;
    Board board;

    @Before
    public void setUp() {
        GameFactory gf = new GameFactory();
        board = gf.getBoard();

        Player player1 = new Player("player1", null, 0);
        Player player2 = new Player("player2", null, 1);
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

    @Test
    public void testMatch() {
        Player player1 = match.getActivePlayer();
        Square currentSquare = match.getActivePlayerCurrentSquare();
        MovementsCard queen = new LineAndDiagonalMovementsCard(board, null, 3, Color.RED);

        Deck deck = player1.getDeck();
        deck.setFirstCardInHand(queen);

        Trump trump = new RemovingColorTrump("Remove", 1, null, 0, false, Color.RED);
        trump.affect(player1);

        Assert.assertTrue(queen.getSquarePossibleColors().isEmpty());
        Assert.assertTrue(queen.getPossibleMovements(currentSquare).isEmpty());
    }

    @Test
    public void testMatchWizard() {
        Player player1 = match.getActivePlayer();
        Square currentSquare = match.getActivePlayerCurrentSquare();
        List<Color> additionalColor = new ArrayList<>();
        additionalColor.add(Color.ALL);
        MovementsCard queen = new LineAndDiagonalMovementsCard(board, null, 1, Color.RED, additionalColor);
        Deck deck = player1.getDeck();
        deck.setFirstCardInHand(queen);

        Trump removeRed = new RemovingColorTrump("Remove", 1, null, 0, false, Color.RED);
        removeRed.affect(player1);
        Trump removeBlue = new RemovingColorTrump("Remove Blue", 1, null, 0, false, Color.BLUE);
        removeBlue.affect(player1);

        Assert.assertFalse(queen.getSquarePossibleColors().contains(Color.BLUE));
        Assert.assertFalse(queen.getSquarePossibleColors().contains(Color.RED));
        Assert.assertTrue(queen.getPossibleMovements(currentSquare).isEmpty());
    }

    @Test
    public void testMatchRider() {
        Player player1 = match.getActivePlayer();
        Square currentSquare = match.getActivePlayerCurrentSquare();

        MovementsCard knight = new KnightMovementsCard(board, null, 1, Color.RED);
        Deck deck = player1.getDeck();
        deck.setFirstCardInHand(knight);

        Trump removeRed = new RemovingColorTrump("Remove", 1, null, 0, false, Color.RED);
        removeRed.affect(player1);

        Assert.assertTrue(knight.getSquarePossibleColors().isEmpty());
        Assert.assertTrue(knight.getPossibleMovements(currentSquare).isEmpty());
    }
}
