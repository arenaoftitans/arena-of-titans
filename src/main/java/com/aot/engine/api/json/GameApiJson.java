package com.aot.engine.api.json;

import com.aot.engine.Match;
import com.aot.engine.api.RequestType;
import com.aot.engine.lobby.SlotState;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import java.lang.reflect.Type;
import java.util.List;

public class GameApiJson {

    public static class GameInitialized {

        private String rt;
        private String player_id;
        private int index;
        private boolean is_game_master;
        private List<UpdatedSlot> slots;

        public GameInitialized(String playerId) {
            this.player_id = playerId;
            rt = RequestType.GAME_INITIALIZED.toString();
            is_game_master = false;
        }

        public void setIs_game_master(boolean is_game_master) {
            this.is_game_master = is_game_master;
        }

        public void setIndex(int index) {
            this.index = index;
        }

        public void setSlots(List<UpdatedSlot> slots) {
            this.slots = slots;
        }

        public String toJson() {
            Gson gson = new GsonBuilder()
                    .registerTypeAdapter(UpdatedSlot.class,
                            (JsonSerializer<UpdatedSlot>) (UpdatedSlot t, Type type,
                                    JsonSerializationContext jsc) -> {
                        t.setPlayerId(null);
                        Gson gson1 = new Gson();
                return gson1.toJsonTree(t, UpdatedSlot.class);
            })
                    .create();
            return gson.toJson(this, GameInitialized.class);
        }
    }

    public class PlayerRequest {

        private RequestType rt;
        private String player_id;
        private UpdatedSlot slot_updated;
        private PlayRequest play_request;
        private List<JsonPlayer> create_game_request;
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

        public UpdatedSlot getSlotUpdated() {
            return slot_updated;
        }

        public List<JsonPlayer> getCreateGame() {
            return create_game_request;
        }
    }

    public static class UpdatedSlot {
        RequestType rt;
        String player_name;
        String player_id;
        int index;
        SlotState state;

        public String getPlayerId() {
            return player_id;
        }

        public void setPlayerId(String playerId) {
            player_id = playerId;
        }

        public int getIndex() {
            return index;
        }

        public void setIndex(int index) {
            this.index = index;
        }

        public void setState(SlotState state) {
            this.state = state;
        }

        public SlotState getState() {
            return state;
        }

        public String toJson() {
            rt = RequestType.SLOT_UPDATED;
            Gson gson = new Gson();
            return gson.toJson(this, UpdatedSlot.class);
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
