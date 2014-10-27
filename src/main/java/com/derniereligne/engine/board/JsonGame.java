package com.derniereligne.engine.board;

import java.util.Map;

/**
 * Used by gson to represent all the board from JSON to Java.
 * @author jenselme
 */
class JsonGame {
    private Map<String, JsonBoard> boards;

    JsonBoard get(String boardName) {
        return boards.get(boardName);
    }

    @Override
    public String toString() {
        return boards.toString();
    }
}
