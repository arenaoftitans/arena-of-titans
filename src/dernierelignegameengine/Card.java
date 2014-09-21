package dernierelignegameengine;

import java.util.HashSet;
import java.util.Set;

public abstract class Card {
    protected final String name;
    protected final Color color;
    protected final int numberOfMovements;
    protected Board board;

    public Card(Board board, String name, int numberOfMovements, Color color) {
        this.board = board;
        this.name = name;
        this.numberOfMovements = numberOfMovements;
        this.color = color;
    }

    public abstract Set<Square> getPossibleMovements(Square currentSquare);

    protected Set<Square> getLineMovements(Square square) {
        return getLineMovements(square, numberOfMovements);
    }

    private Set<Square> getLineMovements(Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossSquares = board.getLineSquares(currentSquare, color);
            for (Square square : crossSquares) {
                if (square != null) {
                    movements.add(square);
                    movements.addAll(getLineMovements(square, numberMovements - 1));
                }
            }
       }
        return movements;
    }

    protected Set<Square> getDiagonalMovements(Square square) {
        return getDiagonalMovements(square, numberOfMovements);
    }

    private Set<Square> getDiagonalMovements(Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossSquares = board.getDiagonalSquares(currentSquare, color);
            for (Square square : crossSquares) {
                if (square != null) {
                    movements.add(square);
                    movements.addAll(getDiagonalMovements(square, numberMovements - 1));
                }
            }
       }

        return movements;
    }

    protected Set<Square> getLineAndDiagonalMovements(Square currentSquare) {
        return getLineAndDiagonalMovements(currentSquare, numberOfMovements);
    }

    private Set<Square> getLineAndDiagonalMovements(Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossLineSquares = board.getLineSquares(currentSquare, color);
            for (Square square : crossLineSquares) {
                if (square != null) {
                    movements.add(square);
                    movements.addAll(getLineAndDiagonalMovements(square, numberMovements - 1));
                }
            }

            Square[] crossDiagSquares = board.getDiagonalSquares(currentSquare, color);
            for (Square square : crossDiagSquares) {
                if (square != null) {
                    movements.add(square);
                    movements.addAll(getLineAndDiagonalMovements(square, numberMovements - 1));
                }
            }
        }
        return movements;
    }
}
