package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.Set;

public class WizardCard extends Card {
    public WizardCard(Board board, Color color) {
        super(board, "Wizard", 1, color);
        possibleSquaresColor.add(Color.BLUE);
        possibleSquaresColor.add(Color.BLACK);
        possibleSquaresColor.add(Color.RED);
        possibleSquaresColor.add(Color.YELLOW);
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = getLineAndDiagonalMovements(currentSquare);

        return possibleMovements;
    }
}
