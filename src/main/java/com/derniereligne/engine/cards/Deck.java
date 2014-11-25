package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Deck {
    private static final int CARDS_IN_HANDS = 5;
    private List<MovementsCard> graveyard;
    private List<MovementsCard> hand;
    private List<MovementsCard> remainingCards;

    /**
     * <b>Constructs a deck with empty hand and empty graveyard.</b>
     *
     * @param remainingCards
     *          New deck of card to use.
     *
     * @see #remainingCards
     * @see #graveyard
     * @see #hand
     *
     * @see MovementsCard
     *
     * @since 1.0
     */
    public Deck(List<MovementsCard> remainingCards) {
        graveyard = new ArrayList<>();
        hand = new ArrayList<>();
        this.remainingCards = remainingCards;
    }

    /**
     * <b>Initialize the hand.</b>
     * <div>
     *  Extracts 5 cards from the deck and put them in hand.
     * </div>
     *
     * @see #hand
     * @see #extractCardFromRemainingCards()
     *
     * @since 1.0
     */
    public void initDeck() {
        for (int i = 0; i < CARDS_IN_HANDS; i++) {
            hand.add(extractCardFromRemainingCards());
        }
    }

    /**
     * <b>Playing the given card and returning the new card.</b>
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
     * @see #extractCardFromRemainingCards()
     *
     * @see MovementsCard
     *
     * @since 1.0
     */
    public MovementsCard playCard(MovementsCard cardToPlay) {
        if (cardToPlay == null) {
            return null;
        } else if (!hand.contains(cardToPlay)) {
            return null;
        } else {
            hand.remove(cardToPlay);
            graveyard.add(cardToPlay);
            MovementsCard newCard = extractCardFromRemainingCards();
            if (newCard == null ) {
                return null;
            } else {
                hand.add(newCard);
                return newCard;
            }
        }
    }

    /**
     * <b>Returns the remaining cards.</b>
     *
     * @return
     *          The remaining cards.
     *
     * @see #remainingCards
     *
     * @since 1.0
     */
    public List<MovementsCard> getRemainingCards() {
        return remainingCards;
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
     * <b>Extracts a card from the remaining cards.</b>
     * <div>
     *  Shuffles the deck, take the first one, remove it from the deck and returns it.
     * </div>
     *
     * @return
     *          A card from the deck.
     *
     * @see #remainingCards
     *
     * @see MovementsCard
     *
     * @since 1.0
     */
    private MovementsCard extractCardFromRemainingCards() {
        Collections.shuffle(remainingCards);
        MovementsCard toReturn = null;
        if (!remainingCards.isEmpty()) {
            toReturn = remainingCards.get(0);
        }
        if (toReturn != null) {
            remainingCards.remove(0);
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
        for (MovementsCard card : remainingCards) {
            String currentCardName = card.getName().toLowerCase();
            if (currentCardName.equals(cardName) && card.getColor().equals(cardColor)) {
                return card;
            }
        }

        return null;
    }
}
