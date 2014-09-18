package dernierelignegameengine;

import java.util.Set;

public class WarriorCard extends Card {

    public WarriorCard(Board board, Color color) {
        super(board, "Warrior", 3, color);
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = getLineMovements(currentSquare);

        return possibleMovements;
    }

}
