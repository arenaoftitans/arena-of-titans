package com.derniereligne.engine;

import com.derniereligne.engine.cards.movements.JsonMovementsCards;
import com.derniereligne.engine.board.JsonBoard;
import com.derniereligne.engine.cards.trumps.JsonTrump;
import java.util.List;

/**
 * Used by gson to represent all the board from JSON to Java.
 *
 * @author jenselme
 */
public class JsonGame {

    private List<String> colors;
    private JsonMovementsCards movementsCards;
    private JsonBoard board;
    private List<JsonTrump> trumps;

    public List<String> getColors() {
        return colors;
    }

    public JsonMovementsCards getMovementsCards() {
        return movementsCards;
    }

    public JsonBoard getBoard() {
        return board;
    }

    public List<JsonTrump> getTrumps() {
        return trumps;
    }

}
