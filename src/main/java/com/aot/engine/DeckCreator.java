package com.aot.engine;

import com.aot.engine.cards.Deck;

/**
 * <b>Interface used to easily create a deck per player.</b>
 *
 * @author "Arena of Titans" first development team
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
