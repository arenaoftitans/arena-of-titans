package com.derniereligne.engine.cards.trumps;

import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.Match;
import com.derniereligne.engine.Player;
import com.derniereligne.engine.board.Board;
import java.util.ArrayList;
import java.util.List;
import org.junit.After;
import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Test;

public class AddingTurnTrumpCardTest {
    AddingTurnTrumpCard trumpCard;

    Player player1;
    Player player2;

    Match match;

    @Before
    public void setUp() {
        GameFactory gf = new GameFactory();
        Board board = gf.getBoard();

        trumpCard = new AddingTurnTrumpCard(null, 1, null, 0, 2);
        player1 = new Player("player1", 0);
        player1.addTrumpCardToAffecting(trumpCard);
        player2 = new Player("player2", 1);
        List<Player> players = new ArrayList<>();
        players.add(player1);
        players.add(player2);

        match = new Match(players, board, gf.getDeckCreator());
    }

    @After
    public void tearDown() {
        trumpCard = null;
        player1 = null;
        player2 = null;
        match = null;
    }

    @Test
    public void testAffect() {
        trumpCard.affect(null);
        TrumpCard trumpCard2 = new AddingTurnTrumpCard(null, 0, null, 0, 2);
        player1.addTrumpCardToAffecting(trumpCard2);
        assertEquals(match.getActivePlayer(), player1);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player1);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player1);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player1);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player1);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player1);
        match.playTurn(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
    }
}