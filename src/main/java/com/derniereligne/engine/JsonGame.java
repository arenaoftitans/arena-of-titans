package com.derniereligne.engine;

import com.derniereligne.engine.cards.movements.JsonMovementsCards;
import com.derniereligne.engine.board.JsonBoard;
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

    public List<String> getColors() {
        return colors;
    }

    public JsonMovementsCards getMovementsCards() {
        return movementsCards;
    }

    public JsonBoard getBoard() {
        return board;
    }

}
