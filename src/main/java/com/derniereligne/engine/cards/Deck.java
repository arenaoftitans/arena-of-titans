package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Deck {

    private static final int CARDS_IN_HANDS = 5;
    private static final String CARD_NAME_KEY = "name";
    private static final String CARD_COLOR_KEY = "color";

    private final List<MovementsCard> cardsList;
    private List<MovementsCard> graveyard;
    private List<MovementsCard> hand;
    private List<MovementsCard> stock;

    /**
     * <b>Constructs a deck with empty hand and empty graveyard.</b>
     *
     * @param cardsList New deck of card to use.
     *
     * @see #stock
     * @see #graveyard
     * @see #hand
     *
     * @see MovementsCard
     *
     * @since 1.0
     */
    public Deck(List<MovementsCard> cardsList) {
        hand = new ArrayList<>();
        graveyard = new ArrayList<>();
        this.cardsList = cardsList;
        initDeck();
    }

    /**
     * <b>Initialize the hand.</b>
     * <div>
     * Extracts 5 cards from the deck and put them in hand.
     * </div>
     *
     * @see #hand
     * @see #drawNextCard()
     *
     * @since 1.0
     */
    private void initDeck() {
        initStock();
        for (int i = 0; i < CARDS_IN_HANDS; i++) {
            hand.add(drawNextCard());
        }
    }

    /**
     * Initialize the stock of cards.
     *
     * @see #stock
     */
    private void initStock() {
        stock = new ArrayList<>(cardsList);
        Collections.shuffle(stock);
    }

    /**
     * <b>Playing the given card and returning the new card.</b>
     * <div>
     * If the given card is null or if its not contained in the hand or if there is no more cards in
     * the deck, null will be returned.
     * </div>
     *
     * @param cardToPlay Try to play this card that should be contained in the hand.
     *
     * @return The new card taken from the deck.
     *
     * @see #graveyard
     * @see #hand
     * @see #drawNextCard()
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
            MovementsCard newCard = drawNextCard();
            hand.remove(cardToPlay);
            graveyard.add(cardToPlay);
            hand.add(newCard);
            return newCard;
        }
    }

    /**
     * <b>Extracts a card from the remaining cards.</b>
     * <div>
     * Shuffles the deck, take the first one, remove it from the deck and returns it.
     * </div>
     *
     * @return A card from the deck.
     *
     * @see #stock
     *
     * @see MovementsCard
     *
     * @since 1.0
     */
    private MovementsCard drawNextCard() {
        if (stock.isEmpty()) {
            // Reinit deck
            initStock();
            // removeCardsInHandFromStock
            hand.stream().forEach((card) -> {
                stock.remove(card);
            });
        }

        MovementsCard drawnCard = stock.get(0);
        stock.remove(drawnCard);

        return drawnCard;
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

        // We test if the color exists.
        try {
            Color cardColor = Color.valueOf(cardColorName.toUpperCase());
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
    private MovementsCard getCard(String cardName, Color cardColor) {
        return hand.parallelStream()
                .filter(mc -> cardName.toLowerCase().equals(mc.getName().toLowerCase())
                    && mc.getColor().equals(cardColor))
                .findFirst().get();
    }

    public boolean isCardInHand(MovementsCard card) {
        return hand.contains(card);
    }

    public boolean isCardInStock(MovementsCard card) {
        return stock.contains(card);
    }

    public boolean isCardInGraveyard(MovementsCard card) {
        return graveyard.contains(card);
    }

    /**
     * <b>Returns the number of cards in the stock.</b>
     *
     * @return number of cards in the stock.
     *
     * @see #stock
     *
     * @since 1.0
     */
    public int getNumberCardsInStock() {
        return stock.size();
    }

    /**
     * <b>Returns the number of cards in graveyard.</b>
     *
     * @return Number of cards in the graveyard.
     *
     * @see #graveyard
     *
     * @since 1.0
     */
    public int getNumberCardsInGraveyard() {
        return graveyard.size();
    }

    /**
     * <b>Returns the number of cards in the hand.</b>
     *
     * @return Number of cards in the hand.
     *
     * @see #hand
     *
     * @since 1.0
     */
    public int getNumberCardsInHand() {
        return hand.size();
    }

    /**
     * <b>Returns the first card of the hand.</b>
     *
     * @return The first card of the hand.
     *
     * @see #hand
     *
     * @since 1.0
     */
    public MovementsCard getFirstCardInHand() {
        return hand.get(0);
    }

    public List<Map<String, String>> getHandForJsonExport() {
        return hand.parallelStream()
                .map((card) -> {
                    Map<String, String> jsonCard = new HashMap<>();
                    jsonCard.put(CARD_NAME_KEY, card.getName());
                    jsonCard.put(CARD_COLOR_KEY, card.getColor().toString());
                    return jsonCard;
                })
                .collect(Collectors.toList());
    }

}
