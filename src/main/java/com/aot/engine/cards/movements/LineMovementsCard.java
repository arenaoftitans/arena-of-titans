package com.aot.engine.cards.movements;

import com.aot.engine.Color;
import com.aot.engine.board.Board;
import com.aot.engine.board.Square;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class LineMovementsCard extends MovementsCard {


    public LineMovementsCard(Board board, String name, int numberOfMovements, Color color) {
        super(board, name, numberOfMovements, color);
        defaultNumberOfMovements = numberOfMovements;
        defaultPossibleSquaresColor = new HashSet<>();
        defaultPossibleSquaresColor.add(color);
        probableSquaresGetter = lineProbableSquaresGetter;
    }

    public LineMovementsCard(Board board, String name, int numberOfMovements, Color color, List<Color> addtionalMovementsColor) {
        super(board, name, numberOfMovements, color, addtionalMovementsColor);
        probableSquaresGetter = lineProbableSquaresGetter;
    }

    @Override
    public Set<String> getPossibleMovements(Square currentSquare) {
        return getLineMovements(currentSquare);
    }
}
