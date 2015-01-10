package com.derniereligne.engine.trumps;

import com.derniereligne.engine.trumps.Trump;
import com.derniereligne.engine.trumps.ModifyNumberOfMovesInATurnTrump;
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

public class ModifyNumberOfMovesInATurnTrumpTest {
    ModifyNumberOfMovesInATurnTrump trump;

    Player player1;
    Player player2;

    Match match;

    @Before
    public void setUp() {
        GameFactory gf = new GameFactory();
        Board board = gf.getBoard();

        trump = new ModifyNumberOfMovesInATurnTrump(null, 1, null, 0, false, 2);
        player1 = new Player("player1", 0);
        player1.addTrumpToAffecting(trump);
        player2 = new Player("player2", 1);
        List<Player> players = new ArrayList<>();
        players.add(player1);
        players.add(player2);

        match = new Match(players, board, gf.getDeckCreator(), null);
    }

    @After
    public void tearDown() {
        trump = null;
        player1 = null;
        player2 = null;
        match = null;
    }

    @Test
    public void testAffect() {
        trump.affect(null);
        Trump trump2 = new ModifyNumberOfMovesInATurnTrump(null, 0, null, 0, false, 2);
        player1.addTrumpToAffecting(trump2);
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