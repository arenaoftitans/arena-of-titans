package com.aot.engine.api.json;

import com.aot.engine.Match;
import com.aot.engine.api.RequestType;

public class GameApiJson {

    public class ClientRequest {

        private String card_name;
        private String card_color;
        private String player_id;
        private Integer x;
        private Integer y;
        private boolean pass;
        private boolean discard;
        private RequestType rt;

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

        public boolean nonNullCardNameAndColor(Match match) {
            return getCardName() != null
                    && getCardColor() != null;
        }

        public boolean nonNullDestinationCoordinates() {
            return getX() != null && getY() != null;
        }

        public boolean isPlayerIdCorrect(Match match) {
            return getPlayerId() != null && getPlayerId().equals(match.getActivePlayeId());
        }

        public RequestType getRequestType() {
            return rt;
        }
    }

}
