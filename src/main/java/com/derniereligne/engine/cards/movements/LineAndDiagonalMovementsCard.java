package com.derniereligne.engine.cards.movements;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import java.util.Set;

public class LineAndDiagonalMovementsCard extends MovementsCard {

    public LineAndDiagonalMovementsCard(Board board, String name, int numberOfMovements, Color color) {
        super(board, "Assassin", 2, color);
        probableSquaresGetter = lineAndDiagonalProbableSquaresGetter;
    }

    public LineAndDiagonalMovementsCard(Board board, String name, int numberOfMovements, Color color, Color[] addtionalMovementsColor) {
        super(board, name, numberOfMovements, color, addtionalMovementsColor);
        probableSquaresGetter = lineAndDiagonalProbableSquaresGetter;
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        return getLineAndDiagonalMovements(currentSquare);
    }

}
