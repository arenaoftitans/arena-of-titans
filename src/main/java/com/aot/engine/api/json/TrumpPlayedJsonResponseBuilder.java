
package com.aot.engine.api.json;

import com.aot.engine.Match;
import static com.aot.engine.api.RequestType.PLAY_TRUMP;
import com.google.gson.Gson;
import java.util.List;

public class TrumpPlayedJsonResponseBuilder {

    private TrumpPlayedJsonResponseBuilder() {
    }

    private static class TrumpPlayedJsonResponse {
        private String rt;
        private List<TrumpJson> play_trump;

        public TrumpPlayedJsonResponse(List<TrumpJson> play_trump, String rt) {
            this.rt = rt;
            this.play_trump = play_trump;
        }
    }

    public static String build(Match match) {
        List<TrumpJson> trumpPlayedJsonResponse = match.getActiveTrumpsForJsonExport();

        Gson gson = new Gson();
        TrumpPlayedJsonResponse response = new TrumpPlayedJsonResponse(trumpPlayedJsonResponse, PLAY_TRUMP.toString());

        return gson.toJson(response);
    }

}
