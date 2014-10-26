package com.derniereligne.engine.board;

import java.util.Map;

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
