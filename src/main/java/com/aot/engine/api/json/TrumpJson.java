
package com.aot.engine.api.json;

import java.util.List;

public class TrumpJson {

    private int playerIndex;
    private String playerName;
    private List<String> trumpNames;

    public void setPlayerIndex(int playerIndex) {
        this.playerIndex = playerIndex;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public void setTrumpNames(List<String> trumpNames) {
        this.trumpNames = trumpNames;
    }

}
