package dernierelignegameengine;

import java.util.HashSet;
import java.util.Set;

public class RiderCard extends Card {

    public RiderCard(Board board, Color color) {
        super(board, "Rider", 1, color);
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = new HashSet<>();
        // Color is not relevant for those squares.
        Square[] temporarySquares = {
            new Square(currentSquare.x, currentSquare.y + 2, cardColor),
            new Square(currentSquare.x, currentSquare.y - 2, cardColor)
            };

        for (Square temporarySquare : temporarySquares) {
            Square[] possibleSquares = getPossibleSquares(temporarySquare);

            add(possibleSquares, possibleMovements);
        }

        return possibleMovements;
    }

    private Square[] getPossibleSquares(Square temporarySquare) {
        Square[] squares = new Square[2];
        squares[0] = board.getLeftSquare(temporarySquare, possibleSquaresColor);
        squares[1] = board.getRightSquare(temporarySquare, possibleSquaresColor);

        return squares;
    }

    private void add(Square[] possibleSquares, Set<Square> possibleMovements) {
        for (Square square : possibleSquares) {
            if (square != null) {
                possibleMovements.add(square);
            }
        }
    }
}
