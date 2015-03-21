
package com.aot.engine.api.json;

import com.aot.engine.Match;
import com.google.gson.Gson;
import java.util.List;

public class TrumpPlayedJsonResponseBuilder extends JsonResponse {

    private TrumpPlayedJsonResponseBuilder() {
    }

    public static String build(Match match) {
        List<TrumpPlayedJsonResponse> trumpPlayedJsonResponse = match.getActiveTrumpsForJsonExport();

        String output = createOutputJson(trumpPlayedJsonResponse);

        return formatJsonWithRequestType(output, "play_trump");
    }

    private static String createOutputJson(List<TrumpPlayedJsonResponse> trumpPlayedJsonResponse) {
        Gson gson = new Gson();
        return gson.toJson(trumpPlayedJsonResponse);
    }

}
