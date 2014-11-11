package com.derniereligne.engine;

import java.util.Map;

/**
 * Used by gson to represent all the board from JSON to Java.
 * @author jenselme
 */
class JsonGame {
    private Map<String, JsonBoard> standard_board;

    JsonBoard get(String boardName) {
        return standard_board.get(boardName);
    }

    @Override
    public String toString() {
        return standard_board.toString();
    }
}
