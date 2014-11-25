/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.cards.movements.DiagonalMovementsCard;
import com.derniereligne.engine.cards.movements.KnightMovementsCard;
import com.derniereligne.engine.cards.movements.LineAndDiagonalMovementsCard;
import com.derniereligne.engine.cards.movements.LineMovementsCard;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

/**
 *
 * @author jenselme
 */
public class DeckTest {

    private Deck deck;

    @Before
    public void init() {
        GameFactory gameFactory = new GameFactory();
        deck = gameFactory.getDeck();
    }

    @Test
    public void testGetCard_String_String() {
        assertEquals(new LineAndDiagonalMovementsCard(null, "Queen", 2, Color.RED),
                deck.getCard("Queen", "red"));

        List<Color> additionalColors = new ArrayList<>();
        additionalColors.add(Color.BLUE);
        assertEquals(new DiagonalMovementsCard(null, "Bishop", 2, Color.BLACK, additionalColors),
                deck.getCard("Bishop", Color.BLACK));

        additionalColors = new ArrayList<>();
        additionalColors.add(Color.ALL);
        assertEquals(new LineAndDiagonalMovementsCard(null, "Wizard", 1, Color.YELLOW, additionalColors),
                deck.getCard("Wizard", "yellow"));

        assertEquals(new LineMovementsCard(null, "King", 3, Color.BLACK),
                deck.getCard("King", Color.BLACK));

        assertEquals(new KnightMovementsCard(null, "Knight", 1, Color.BLACK),
                deck.getCard("Knight", Color.BLACK));
    }

    @Test
    public void testGetCardNullName() {
        assertNull(deck.getCard(null, Color.BLACK));
        assertNull(deck.getCard(null, "Black"));
    }

    @Test
    public void testGetCardInvalidCard() {
        assertNull(deck.getCard("Spock", Color.BLACK));
        assertNull(deck.getCard("Dorothy", Color.BLACK));
    }

    @Test
    public void testGetCardInvalidColor() {
        assertNull(deck.getCard("King", "king"));
    }

    @Test
    public void testInitDeck() {
        int deckSize = deck.getRemainingCards().size();
        deck.initDeck();
        assertEquals(deck.getRemainingCards().size(), deckSize - deck.getGraveyard().size() - deck.getHand().size());
        assertEquals(deck.getGraveyard().size(), 0);
        assertEquals(deck.getHand().size(), 5);
    }

    @Test
    public void testPlayCardWithExistingCard() {
        int deckSize = deck.getRemainingCards().size();
        deck.initDeck();
        MovementsCard playedCard = deck.getHand().get(0);
        deck.playCard(playedCard);
        assertEquals(deck.getRemainingCards().size(), deckSize - deck.getHand().size() - deck.getGraveyard().size());
        assertEquals(deck.getHand().size(), 5);
        assertEquals(deck.getGraveyard().size(), 1);
        assertTrue(deck.getGraveyard().contains(playedCard));
        assertFalse(deck.getHand().contains(playedCard));
        assertFalse(deck.getRemainingCards().contains(playedCard));
        assertFalse(deck.getHand().contains(null));
    }

    @Test
    public void testPlayCardWithNullCard() {
        int deckSize = deck.getRemainingCards().size();
        deck.initDeck();
        deck.playCard(null);
        assertEquals(deck.getRemainingCards().size(), deckSize - deck.getHand().size() - deck.getGraveyard().size());
        assertEquals(deck.getHand().size(), 5);
        assertEquals(deck.getGraveyard().size(), 0);
    }

    @Test
    public void testPlayNotContainedCard() {
        int deckSize = deck.getRemainingCards().size();
        deck.initDeck();
        deck.playCard(deck.getRemainingCards().get(0));
        assertEquals(deck.getRemainingCards().size(), deckSize - deck.getHand().size() - deck.getGraveyard().size());
        assertEquals(deck.getHand().size(), 5);
        assertEquals(deck.getGraveyard().size(), 0);
    }

    @Test
    public void testExtractNull() {
        int deckSize = deck.getRemainingCards().size();
        deck.initDeck();

        while (deck.getHand().size() == 5) {
            deck.playCard(deck.getHand().get(0));
        }

        assertEquals(deck.getRemainingCards().size(), 0);
        assertEquals(deck.getHand().size(), 4);
        assertEquals(deck.getGraveyard().size(), deckSize - deck.getHand().size());

        for (int i = 3; i >=0; i--) {
            deck.playCard(deck.getHand().get(0));
            assertEquals(deck.getRemainingCards().size(), 0);
            assertEquals(deck.getHand().size(), i);
            assertEquals(deck.getGraveyard().size(), deckSize - deck.getHand().size());
        }
    }
}
