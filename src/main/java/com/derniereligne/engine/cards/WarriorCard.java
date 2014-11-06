package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.Set;

public class WarriorCard extends Card {

    public WarriorCard(Board board, Color color) {
        super(board, "Warrior", 1, color, "line");
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = getLineMovements(currentSquare);

        return possibleMovements;
    }

}
