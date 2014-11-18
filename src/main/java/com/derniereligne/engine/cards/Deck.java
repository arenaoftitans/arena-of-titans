package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Deck {
    private List<MovementsCard> graveyard;
    private List<MovementsCard> hand;
    private List<MovementsCard> deck;

    /**
     * <b>Constructs a deck with empty hand and empty graveyard.</b>
     *
     * @param deck
     *          New deck of card to use.
     *
     * @see #deck
     * @see #graveyard
     * @see #hand
     *
     * @see MovementsCard
     *
     * @since 1.0
     */
    public Deck(List<MovementsCard> deck) {
        graveyard = new ArrayList<>();
        hand = new ArrayList<>();
        this.deck = deck;
    }

    /**
     * <b>Initialize the hand.</b>
     * <div>
     *  Extracts 5 cards from the deck and put them in hand.
     * </div>
     *
     * @see #hand
     * @see #extractCardFromDeck()
     *
     * @since 1.0
     */
    public void initDeck() {
        for (int i = 0; i < 5; i++) {
            hand.add(extractCardFromDeck());
        }
    }

    /**
     * <b>Playing the given card and returning the new card for the hand.</b>
     * <div>
     *  If the given card is null or if its not contained in the hand or if there is no more cards in the deck,
     * null will be returned.
     * </div>
     *
     * @param cardToPlay
     *          Try to play this card that should be contained in the hand.
     *
     * @return
     *          The new card taken from the deck.
     *
     * @see #graveyard
     * @see #hand
     * @see #extractCardFromDeck()
     *
     * @see MovementsCard
     *
     * @since 1.0
     */
    public MovementsCard playCard(MovementsCard cardToPlay) {
        if (cardToPlay != null && hand.contains(cardToPlay)) {
            hand.remove(cardToPlay);
            graveyard.add(cardToPlay);
            MovementsCard newCard = extractCardFromDeck();
            if (newCard == null) {
                return null;
            } else {
                hand.add(newCard);
                return newCard;
            }
        } else {
            return null;
        }
    }

    /**
     * <b>Returns the deck.</b>
     *
     * @return
     *          The deck.
     *
     * @see #deck
     *
     * @since 1.0
     */
    public List<MovementsCard> getDeck() {
        return deck;
    }

    /**
     * <b>Returns the graveyard.</b>
     *
     * @return
     *          The graveyard.
     *
     * @see #graveyard
     *
     * @since 1.0
     */
    public List<MovementsCard> getGraveyard() {
        return graveyard;
    }

    /**
     * <b>Returns the hand.</b>
     *
     * @return
     *          The hand.
     *
     * @see #hand
     *
     * @since 1.0
     */
    public List<MovementsCard> getHand() {
        return hand;
    }

    /**
     * <b>Extracts a card from the deck.</b>
     * <div>
     *  Shuffles the deck, take the first one, remove it from the deck and returns it.
     * </div>
     *
     * @return
     *          A card from the deck.
     *
     * @see #deck
     *
     * @see MovementsCard
     *
     * @since 1.0
     */
    private MovementsCard extractCardFromDeck() {
        Collections.shuffle(deck);
        MovementsCard toReturn = deck.get(0);
        if (toReturn != null) {
            deck.remove(toReturn);
        }
        return toReturn;
    }

    /**
     * <b>Returns the card object that the player selected.</b>
     * <div>
     * The card returned will be a card of the type given in the parameter cardType and with the
     * color given in the parameter color. For exemple, calling getCard(board,"warrior","red") will
     * return a red warrior.<br/>The default card returned is a yellow warrior.
     * </div>
     *
     * @param cardName The name of the card to get.
     * @param cardColorName Name of the color of card to get.
     *
     * @return MovementsCard A card on the given board with the given type of the given color.
     *
     * @see Board
     * @see Color
     * @see BishopCard#BishopCard(com.derniereligne.engine.board.Board,
     * com.derniereligne.engine.Color)
     * @see KingCard#KingCard(com.derniereligne.engine.board.Board, com.derniereligne.engine.Color)
     * @see QueenCard#QueenCard(com.derniereligne.engine.board.Board,
     * com.derniereligne.engine.Color)
     * @see RiderCard#RiderCard(com.derniereligne.engine.board.Board,
     * com.derniereligne.engine.Color)
     * @see WarriorCard#WarriorCard(com.derniereligne.engine.board.Board,
     * com.derniereligne.engine.Color)
     * @see WizardCard#WizardCard(com.derniereligne.engine.board.Board,
     * com.derniereligne.engine.Color)
     *
     * @since 1.0
     */
    public MovementsCard getCard(String cardName, String cardColorName) {
        if (cardName == null || cardColorName == null) {
            return null;
        }

        Color cardColor;
        // We test if the color exists.
        try {
            cardColor = Color.valueOf(cardColorName.toUpperCase());
            return getCard(cardName, cardColor);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    /**
     * <b>Returns the card object that the player selected.</b>
     * <div>
     * The card returned will be a card of the type given in the parameter cardType and with the
     * color given in the parameter color. For exemple, calling getCard(board,"warrior","red") will
     * return a red warrior.<br/>The default card returned is a yellow warrior.
     * </div>
     *
     * @param cardName The name of the card to get.
     * @param cardColor The color of card to get.
     *
     * @return MovementsCard A card on the given board with the given type of the given color.
     */
    public MovementsCard getCard(String cardName, Color cardColor) {
        if (cardName == null || cardColor == null) {
            return null;
        }

        cardName = cardName.toLowerCase();
        for (MovementsCard card : deck) {
            String currentCardName = card.getName().toLowerCase();
            if (currentCardName.equals(cardName) && card.getColor().equals(cardColor)) {
                return card;
            }
        }

        return null;
    }
}
