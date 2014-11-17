package com.derniereligne.engine.cards.movements;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import java.util.List;
import java.util.Set;

public class DiagonalMovementsCard extends MovementsCard {

    public DiagonalMovementsCard(Board board, String name, int numberOfMovements, Color color) {
        super(board, name, numberOfMovements, color);
        probableSquaresGetter = diagonalProbableSquaresGetter;
    }

    public DiagonalMovementsCard(Board board, String name, int numberOfMovements, Color color, List<Color> addtionalMovementsColor) {
        super(board, name, numberOfMovements, color, addtionalMovementsColor);
        probableSquaresGetter = diagonalProbableSquaresGetter;
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        return getDiagonalMovements(currentSquare);
    }

}
