package dernierelignegameengine;

import java.util.Set;

public class KingCard extends Card {

    public KingCard(Board board, Color color) {
        super(board, "King", 3, color);
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = getLineMovements(currentSquare);

        return possibleMovements;
    }

}
