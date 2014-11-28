package com.derniereligne.engine;

import com.derniereligne.engine.cards.Deck;

/**
 * <b>Interface used to easily create a deck per player.</b>
 *
 * @author "Dernière Ligne" first development team
 */
@FunctionalInterface
public interface DeckCreator {

    /**
     * <b>Returns a deck of cards.</b>
     *
     * @return A deck.
     */
    public Deck create();

}
