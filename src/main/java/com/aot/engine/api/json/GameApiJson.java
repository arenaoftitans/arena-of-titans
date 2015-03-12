package com.aot.engine.api.json;

import com.aot.engine.Match;

public class GameApiJson {

    public class Move {

        private String card_name;
        private String card_color;
        private String player_id;
        private Integer x;
        private Integer y;
        private boolean pass;
        private boolean discard;

        public String getCardName() {
            return card_name;
        }

        public String getCardColor() {
            return card_color;
        }

        public String getPlayerId() {
            return player_id;
        }

        public Integer getX() {
            return x;
        }

        public Integer getY() {
            return y;
        }

        public boolean pass() {
            return pass;
        }

        public boolean discard() {
            return discard;
        }

        public boolean areInputParemetersIncorrect(Match match) {
            return getCardName() == null
                    || getCardColor() == null
                    || getPlayerId() == null
                    || isPlayerIdIncorrect(match);
        }

        public boolean isPlayerIdIncorrect(Match match) {
            String currentPlayerId = Integer.toString(match.getActivePlayerIndex());
            return !getPlayerId().equals(currentPlayerId);
        }
    }

}
