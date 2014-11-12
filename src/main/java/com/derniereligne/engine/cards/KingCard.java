package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.Set;

public class KingCard extends Card {

    public KingCard(Board board, Color color) {
        super(board, "King", 3, color, "line");
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = getLineMovements(currentSquare);

        return possibleMovements;
    }

}
