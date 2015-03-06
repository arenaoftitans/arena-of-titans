package com.aot.engine.cards.movements;

import com.aot.engine.Color;
import com.aot.engine.board.Board;
import com.aot.engine.board.Square;
import java.util.List;
import java.util.Set;

public class DiagonalMovementsCard extends MovementsCard {

    public DiagonalMovementsCard(Board board, String name, int numberOfMovements, Color color) {
        super(board, name, numberOfMovements, color);
        resetLambdas();
    }

    private void resetLambdas() {
        probableSquaresGetter = diagonalProbableSquaresGetter;
    }

    public DiagonalMovementsCard(Board board, String name, int numberOfMovements, Color color, List<Color> addtionalMovementsColor) {
        super(board, name, numberOfMovements, color, addtionalMovementsColor);
        resetLambdas();
    }

    @Override
    public Set<String> getPossibleMovements(Square currentSquare) {
        return getDiagonalMovements(currentSquare);
    }

    @Override
    public void prepareForJsonExport() {
        super.nullifyLambdas();
    }

    @Override
    public void resetAfterJsonImport() {
        super.denullifyLambdas();
        resetLambdas();
    }

}
