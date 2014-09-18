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
            Square[] crossSquares = getLineSquares(currentSquare);
            for (Square square : crossSquares) {
                if (board.canMoveTo(square, color)) {
                    movements.add(square);
                    movements.addAll(getLineMovements(square, numberMovements - 1));
                }
            }
       }
        return movements;
    }

    private Square[] getLineSquares(Square currentSquare) {
        Square[] crossSquares = new Square[4];

        crossSquares[0] = getUpSquare(currentSquare);
        crossSquares[1] = getDownSquare(currentSquare);
        crossSquares[2] = getLeftSquare(currentSquare);
        crossSquares[3] = getRightSquare(currentSquare);

        return crossSquares;
    }

    private Square getUpSquare(Square square) {
        return new Square(square.x, square.y + 1, Color.VOID);
    }

    private Square getDownSquare(Square square) {
        return new Square(square.x, square.y - 1, Color.VOID);
    }

    private Square getLeftSquare(Square square) {
        int newAbs = board.correctAbs(square.x - 1);
        return new Square(newAbs, square.y, Color.VOID);
    }

    private Square getRightSquare(Square square) {
        int newAbs = board.correctAbs(square.x + 1);
        return new Square(newAbs, square.y, Color.VOID);
    }

    protected Set<Square> getDiagonalMovements(Square square) {
        return getDiagonalMovements(square, numberOfMovements);
    }

    private Set<Square> getDiagonalMovements(Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossSquares = getDiagonalSquares(currentSquare);
            for (Square square : crossSquares) {
                if (board.canMoveTo(square, color)) {
                    movements.add(square);
                    movements.addAll(getDiagonalMovements(square, numberMovements - 1));
                }
            }
       }

        return movements;
    }

    private Square[] getDiagonalSquares(Square currentSquare) {
        Square[] crossSquares = new Square[4];

        crossSquares[0] = getUpLeftSquare(currentSquare);
        crossSquares[1] = getUpRightSquare(currentSquare);
        crossSquares[2] = getDownLeftSquare(currentSquare);
        crossSquares[3] = getDownRightSquare(currentSquare);

        return crossSquares;
    }

    private Square getUpLeftSquare(Square currentSquare) {
        int newAbs = board.correctAbs(currentSquare.x + 1);
        return new Square(newAbs, currentSquare.y + 1, Color.VOID);
    }

    private Square getUpRightSquare(Square currentSquare) {
        int newAbs = board.correctAbs(currentSquare.x - 1);
        return new Square(newAbs, currentSquare.y + 1, Color.VOID);
    }

    private Square getDownLeftSquare(Square currentSquare) {
        int newAbs = board.correctAbs(currentSquare.x + 1);
        return new Square(newAbs, currentSquare.y - 1, Color.VOID);
    }

    private Square getDownRightSquare(Square currentSquare) {
        int newAbs = board.correctAbs(currentSquare.x - 1);
        return new Square(newAbs, currentSquare.y - 1, Color.VOID);
    }

    protected Set<Square> getLineAndDiagonalMovements(Square currentSquare) {
        return getLineAndDiagonalMovements(currentSquare, numberOfMovements);
    }

    private Set<Square> getLineAndDiagonalMovements(Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossLineSquares = getLineSquares(currentSquare);
            for (Square square : crossLineSquares) {
                if (board.canMoveTo(square, color)) {
                    movements.add(square);
                    movements.addAll(getLineAndDiagonalMovements(square, numberMovements - 1));
                }
            }

            Square[] crossDiagSquares = getDiagonalSquares(currentSquare);
            for (Square square : crossDiagSquares) {
                if (board.canMoveTo(square, color)) {
                    movements.add(square);
                    movements.addAll(getLineAndDiagonalMovements(square, numberMovements - 1));
                }
            }
        }
        return movements;
    }
}
