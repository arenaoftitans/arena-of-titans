package dernierelignegameengine;

import java.util.Set;

public class QueenCard extends Card {

    public QueenCard(Color color) {
        super("Queen", 3, color);
    }

    @Override
    public Set<Square> getPossibleMovements(Board board, Square currentSquare) {
        Set<Square> possibleMovements = getLineMovements(board, currentSquare);

        return possibleMovements;
    }

}
