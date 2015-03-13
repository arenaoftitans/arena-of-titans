package com.aot.engine.api.json;

import com.aot.engine.board.Square;
import com.aot.engine.cards.movements.MovementsCard;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PossibleSquaresJson extends JsonResponse {

    public static String get(MovementsCard cardPlayed, Square currentSquare, String requestType) {
        List<String> possibleSquaresIds = new ArrayList<>(cardPlayed.getPossibleMovements(currentSquare));
        Collections.sort(possibleSquaresIds);

        Gson gson = new Gson();
        String json = gson.toJson(possibleSquaresIds);
        return formatJsonWithRequestType(json, requestType);
    }

}
