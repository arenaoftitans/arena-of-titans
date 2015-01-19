/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.trumps;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.Match;
import com.derniereligne.engine.Player;
import com.derniereligne.engine.board.Board;
import java.util.ArrayList;
import java.util.List;
import org.junit.After;
import org.junit.Assert;
import static org.junit.Assert.assertFalse;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author gaussreload
 */
public class TrumpBlockingTrumpTest {
    private Player player1;
    private Trump trump;
    private Trump blockTrump;

    @Before
    public void setUp() {
        trump = new ModifyNumberOfMovesInATurnTrump("test", 2, null, 0, true, -1);

        player1 = new Player("player1", 0);
        player1.addTrumpToAffecting(trump);
        player1.addTrumpToAffecting(blockTrump = new TrumpBlockingTrump("block", 2, null, 0, true, "test"));
    }

    @After
    public void tearDown() {
        player1 = null;
        blockTrump = null;
        trump = null;
    }

    @Test
    public void testBlockingTrump() {
        blockTrump.affect(player1);
        assertFalse(trump.isEnabled());
    }
}
