package dernierelignegameengine;

import java.util.Set;

public class WarriorCard extends Card {

    public WarriorCard(Color color) {
        super("Warrior", 3, color);
    }

    @Override
    public Set<Square> getPossibleMovements(Board board, Square currentSquare) {
        Set<Square> possibleMovements = getLineMovements(board, currentSquare);

        return possibleMovements;
    }

}
