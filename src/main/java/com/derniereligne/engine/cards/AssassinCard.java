
package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.Set;

public class AssassinCard extends Card{
    public AssassinCard(Board board, Color color) {
        super(board, "Assassin", 2, color);
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = getLineAndDiagonalMovements(currentSquare);

        return possibleMovements;
    }
}
