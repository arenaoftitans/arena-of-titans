package dernierelignegameengine;

import java.util.ArrayList;

public class QueenCard extends Card {

    public QueenCard(Color color) {
        super("Queen", 3, color);
    }

    @Override
    public ArrayList<Square> getPossibleMovements(Board board, Square currentSquare) {
        ArrayList<Square> allMovements = getLazyLineAndDiagonalMovements(currentSquare);
        ArrayList<Square> possibleMovements = new ArrayList<>();
        for (Square square : allMovements) {
            possibleMovements.add(square);
        }

        return possibleMovements;
    }

}
