package com.aot.engine.cards.movements;

import com.aot.engine.Color;
import com.aot.engine.board.Board;
import com.aot.engine.board.Square;
import java.util.List;
import java.util.Set;

public class DiagonalMovementsCard extends MovementsCard {

    public DiagonalMovementsCard(Board board, String name, int numberOfMovements, Color color) {
        super(board, name, numberOfMovements, color);
        setPossibleSquareGetter();
    }

    private void setPossibleSquareGetter() {
        probableSquaresGetter = lineProbableSquaresGetter;
    }

    @Override
    protected void resetPossibleSquareGetter() {
        setPossibleSquareGetter();
    }

    public DiagonalMovementsCard(Board board, String name, int numberOfMovements, Color color, List<Color> addtionalMovementsColor) {
        super(board, name, numberOfMovements, color, addtionalMovementsColor);
        setPossibleSquareGetter();
    }

    @Override
    public Set<String> getPossibleMovements(Square currentSquare) {
        return getDiagonalMovements(currentSquare);
    }

}
