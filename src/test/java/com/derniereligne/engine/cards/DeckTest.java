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
    public void testGetCard_String_String() {
        MovementsCard card = deck.getFirstCardInHand();
        String  name = card.getName();
        String color = card.getColor().toString();
        assertEquals(card, deck.getCard(name, color));
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
        int numberOfRemainingCards = deck.getNumberCardsInStock();
        int numberOfPlayedCards = deck.getNumberCardsInGraveyard();
        int numberOfCardsInHand = deck.getNumberCardsInHand();

        assertEquals(NUMBER_TOTAL_OF_CARDS, numberOfRemainingCards + numberOfPlayedCards + numberOfCardsInHand);
        assertEquals(0, numberOfPlayedCards);
        assertEquals(NUMBER_OF_CARDS_IN_HAND, numberOfCardsInHand);
        assertEquals(NUMBER_TOTAL_OF_CARDS - NUMBER_OF_CARDS_IN_HAND, numberOfRemainingCards);
    }

    @Test
    public void testPlayCardWithExistingCard() {
        int numberOfRemainingCardsBeforePlay = deck.getNumberCardsInStock();
        MovementsCard playedCard = deck.getFirstCardInHand();
        deck.playCard(playedCard);
        int numberOfRemainingCardsAfterPlay = deck.getNumberCardsInStock();

        assertEquals(numberOfRemainingCardsAfterPlay, numberOfRemainingCardsBeforePlay - 1);
        assertEquals(NUMBER_OF_CARDS_IN_HAND, deck.getNumberCardsInHand());
        assertEquals(deck.getNumberCardsInGraveyard(), 1);
        assertTrue(deck.isCardInGraveyard(playedCard));
        assertFalse(deck.isCardInHand(playedCard));
        assertFalse(deck.isCardInStock(playedCard));
        assertFalse(deck.isCardInHand(null));
    }

    @Test
    public void testPlayCardWithNullCard() {
        int numberOfRemainingCards = deck.getNumberCardsInStock();
        deck.playCard(null);
        assertEquals(numberOfRemainingCards, deck.getNumberCardsInStock());
        assertEquals(NUMBER_OF_CARDS_IN_HAND, deck.getNumberCardsInHand());
        assertEquals(0, deck.getNumberCardsInGraveyard());
    }

    @Test
    public void testPlayCardWithACardWhichIsNotInTheHand() {
        MovementsCard card = new LineAndDiagonalMovementsCard(null, "Void", 1, Color.BLACK);
        deck.playCard(card);
        assertEquals(deck.getNumberCardsInStock(), NUMBER_TOTAL_OF_CARDS - NUMBER_OF_CARDS_IN_HAND);
        assertEquals(deck.getNumberCardsInHand(), NUMBER_OF_CARDS_IN_HAND);
        assertEquals(deck.getNumberCardsInGraveyard(), 0);
    }

    @Test
    public void testPlayMoreCardsThanTotalCardsInDeck() {
        // Empty stock.
        for (int i = 0; i < NUMBER_TOTAL_OF_CARDS - NUMBER_OF_CARDS_IN_HAND;  i++) {
            MovementsCard cardToPlay = deck.getFirstCardInHand();
            deck.playCard(cardToPlay);
        }
        assertTrue(deck.getNumberCardsInStock() == 0);
        assertEquals(NUMBER_OF_CARDS_IN_HAND, deck.getNumberCardsInHand());

        // Play another card
        MovementsCard cardToPlay = deck.getFirstCardInHand();
        deck.playCard(cardToPlay);

        assertEquals(NUMBER_TOTAL_OF_CARDS - NUMBER_OF_CARDS_IN_HAND - 1, deck.getNumberCardsInStock());
        assertEquals(NUMBER_OF_CARDS_IN_HAND, deck.getNumberCardsInHand());
        // 4 cards have not been played yet.
        assertEquals(NUMBER_TOTAL_OF_CARDS - 4, deck.getNumberCardsInGraveyard());
    }

}
