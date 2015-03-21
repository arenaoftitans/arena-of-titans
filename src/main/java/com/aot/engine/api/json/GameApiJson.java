package com.aot.engine.api.json;

import com.aot.engine.Match;
import com.aot.engine.api.RequestType;

public class GameApiJson {

    public class PlayerRequest {

        private RequestType rt;
        private String player_id;
        private PlayRequest play_request;
        private PlayTrumpRequest trump_request;

        public String getPlayerId() {
            return player_id;
        }

        public boolean isPlayerIdCorrect(Match match) {
            return getPlayerId() != null && getPlayerId().equals(match.getActivePlayeId());
        }

        public RequestType getRequestType() {
            return rt;
        }

        public PlayRequest getPlayRequest() {
            return play_request;
        }

        public PlayTrumpRequest getPlayTrumpRequest() {
            return trump_request;
        }
    }

    public class PlayRequest {

        private String card_name;
        private String card_color;
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

    }

    public class PlayTrumpRequest {

        private String name;
        private Integer target_index;

        public String getTrumpName() {
            return name;
        }

        public Integer getTargetIndex() {
            return target_index;
        }

    }

    public static String buildErrorToDisplay(String message) {
        return "{\"error_to_display\": \"" + message + "\"}";
    }

    public static String buildError(String message) {
        return "{\"error\": \"" + message + "\"}";
    }
}
