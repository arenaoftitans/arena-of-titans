/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.GameFactory;
import com.derniereligne.engine.cards.movements.LineAndDiagonalMovementsCard;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Ignore;

/**
 *
 * @author jenselme
 */
public class DeckTest {

    private Deck deck;
    private static final int NUMBER_OF_COLORS = 4;
    private static final int NUMBER_OF_CARD_TYPES = 7;
    private static final int NUMBER_OF_CARDS_IN_HAND = 5;
    private static final int NUMBER_TOTAL_OF_CARDS = NUMBER_OF_CARD_TYPES * NUMBER_OF_COLORS;

    @Before
    public void init() {
        GameFactory gameFactory = new GameFactory();
        deck = gameFactory.getDeck();
    }

    @Test
    @Ignore
    public void testGetCard_String_String() {
        assertEquals(new LineAndDiagonalMovementsCard(null, "Queen", 2, Color.RED),
                deck.getCard("Queen", "red"));

        List<Color> additionalColors = new ArrayList<>();
        additionalColors.add(Color.BLUE);

        additionalColors = new ArrayList<>();
        additionalColors.add(Color.ALL);
        assertEquals(new LineAndDiagonalMovementsCard(null, "Wizard", 1, Color.YELLOW, additionalColors),
                deck.getCard("Wizard", "yellow"));
    }

    @Test
    public void testGetCardNullName() {
        assertNull(deck.getCard(null, "Black"));
    }

    @Test
    public void testGetCardInvalidColor() {
        assertNull(deck.getCard("King", "king"));
    }

    @Test
    public void testGetCardNullColor() {
        assertNull(deck.getCard("Queen", null));
    }

    @Test
    public void testInitDeck() {
        int numberOfRemainingCards = deck.getRemainingCards().size();
        int numberOfPlayedCards = deck.getGraveyard().size();
        int numberOfCardsInHand = deck.getHand().size();

        assertEquals(NUMBER_TOTAL_OF_CARDS, numberOfRemainingCards + numberOfPlayedCards + numberOfCardsInHand);
        assertEquals(0, numberOfPlayedCards);
        assertEquals(NUMBER_OF_CARDS_IN_HAND, numberOfCardsInHand);
        assertEquals(NUMBER_TOTAL_OF_CARDS - NUMBER_OF_CARDS_IN_HAND, numberOfRemainingCards);
    }

    @Test
    public void testPlayCardWithExistingCard() {
        int numberOfRemainingCardsBeforePlay = deck.getRemainingCards().size();
        MovementsCard playedCard = deck.getHand().get(0);
        deck.playCard(playedCard);
        int numberOfRemainingCardsAfterPlay = deck.getRemainingCards().size();

        assertEquals(numberOfRemainingCardsAfterPlay, numberOfRemainingCardsBeforePlay - 1);
        assertEquals(NUMBER_OF_CARDS_IN_HAND, deck.getHand().size());
        assertEquals(deck.getGraveyard().size(), 1);
        assertTrue(deck.getGraveyard().contains(playedCard));
        assertFalse(deck.getHand().contains(playedCard));
        assertFalse(deck.getRemainingCards().contains(playedCard));
        assertFalse(deck.getHand().contains(null));
    }

    @Test
    public void testPlayCardWithNullCard() {
        int numberOfRemainingCards = deck.getRemainingCards().size();
        deck.playCard(null);
        assertEquals(deck.getRemainingCards().size(), numberOfRemainingCards);
        assertEquals(deck.getHand().size(), NUMBER_OF_CARDS_IN_HAND);
        assertEquals(deck.getGraveyard().size(), 0);
    }

    @Test
    public void testPlayNotContainedCard() {
        deck.playCard(deck.getRemainingCards().get(0));
        assertEquals(deck.getRemainingCards().size(), NUMBER_TOTAL_OF_CARDS - NUMBER_OF_CARDS_IN_HAND);
        assertEquals(deck.getHand().size(), NUMBER_OF_CARDS_IN_HAND);
        assertEquals(deck.getGraveyard().size(), 0);
    }

    @Test
    public void testPlayMoreCardsThanTotalCardsInDeck() {
        // Empty stock.
        for (int i = 0; i < NUMBER_TOTAL_OF_CARDS - NUMBER_OF_CARDS_IN_HAND;  i++) {
            MovementsCard cardToPlay = deck.getHand().get(0);
            deck.playCard(cardToPlay);
        }
        assertTrue(deck.getRemainingCards().isEmpty());
        assertEquals(NUMBER_OF_CARDS_IN_HAND, deck.getHand().size());

        // Play another card
        MovementsCard cardToPlay = deck.getHand().get(0);
        deck.playCard(cardToPlay);

        assertEquals(NUMBER_TOTAL_OF_CARDS - NUMBER_OF_CARDS_IN_HAND - 1, deck.getRemainingCards().size());
        assertEquals(NUMBER_OF_CARDS_IN_HAND, deck.getHand().size());
        // 4 cards have not been played yet.
        assertEquals(NUMBER_TOTAL_OF_CARDS - 4, deck.getGraveyard().size());
    }
}
