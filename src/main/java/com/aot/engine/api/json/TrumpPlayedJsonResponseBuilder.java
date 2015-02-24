
package com.aot.engine.api.json;

import com.aot.engine.Match;
import com.google.gson.Gson;
import java.util.List;
import javax.ws.rs.core.Response;

public class TrumpPlayedJsonResponseBuilder {

    private TrumpPlayedJsonResponseBuilder() {
    }

    public static Response build(Match match) {
        List<TrumpPlayedJsonResponse> trumpPlayedJsonResponse = match.getActiveTrumpsForJsonExport();

        String output = createOutputJson(trumpPlayedJsonResponse);

        return Response.status(Response.Status.OK).entity(output).build();
    }

    private static String createOutputJson(List<TrumpPlayedJsonResponse> trumpPlayedJsonResponse) {
        Gson gson = new Gson();
        return gson.toJson(trumpPlayedJsonResponse);
    }

}
