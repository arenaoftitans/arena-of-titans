package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.cards.movements.MovementsCard;
import java.util.List;

public class Deck {

    private List<MovementsCard> movementsCards;

    public Deck(List<MovementsCard> movementsCards) {
        this.movementsCards = movementsCards;
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
        for (MovementsCard card : movementsCards) {
            String currentCardName = card.getName().toLowerCase();
            if (currentCardName.equals(cardName) && card.getColor().equals(cardColor)) {
                return card;
            }
        }

        return null;
    }
}
