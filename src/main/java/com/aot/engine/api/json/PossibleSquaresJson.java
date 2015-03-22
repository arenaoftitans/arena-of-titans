package com.aot.engine.api.json;

import static com.aot.engine.api.RequestType.VIEW_POSSIBLE_SQUARES;
import com.aot.engine.board.Square;
import com.aot.engine.cards.movements.MovementsCard;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PossibleSquaresJson {

    private static class PossibleSquaresResponse {
        List<String> possible_squares;
        String rt;

        public PossibleSquaresResponse(List<String> possibleSquares, String rt) {
            this.rt = rt;
            this.possible_squares = possibleSquares;
        }

    }

    public static String get(MovementsCard cardPlayed, Square currentSquare) {
        List<String> possibleSquaresIds = new ArrayList<>(cardPlayed.getPossibleMovements(currentSquare));
        Collections.sort(possibleSquaresIds);

        Gson gson = new Gson();
        PossibleSquaresResponse response = new PossibleSquaresResponse(possibleSquaresIds,
                VIEW_POSSIBLE_SQUARES.toString());

        return gson.toJson(response);
    }

}
