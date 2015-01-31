package com.aot.engine;

import com.aot.engine.cards.movements.json.JsonMovementsCards;
import com.aot.engine.board.json.JsonBoard;
import com.aot.engine.trumps.json.JsonTrump;
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
