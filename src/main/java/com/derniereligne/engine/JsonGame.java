package com.derniereligne.engine;

import java.util.Map;

/**
 * Used by gson to represent all the board from JSON to Java.
 * @author jenselme
 */
class JsonGame {
    private Map<String, JsonBoard> standardBoard;

    JsonBoard get(String boardName) {
        return standardBoard.get(boardName);
    }

    @Override
    public String toString() {
        return standardBoard.toString();
    }
}
