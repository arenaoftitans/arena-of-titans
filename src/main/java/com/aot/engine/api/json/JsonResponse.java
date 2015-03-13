
package com.aot.engine.api.json;

public class JsonResponse {

    public static String formatJsonWithRequestType(String json, String requestType) {
        return String.format("{\"%s\": %s}", requestType, json);
    }

}
