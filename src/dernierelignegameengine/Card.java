package dernierelignegameengine;

import java.util.HashSet;
import java.util.Set;

public abstract class Card {
    protected final String name;
    protected final Color color;
    protected final int numberOfMovements;

    public Card(String name, int numberOfMovements, Color color) {
        this.name = name;
        this.numberOfMovements = numberOfMovements;
        this.color = color;
    }

    public abstract Set<Square> getPossibleMovements(Board board, Square currentSquare);

    public Set<Square> getLineMovements(Board board, Square square) {
        return getLineMovements(board, square, numberOfMovements);
    }

    public Set<Square> getLineMovements(Board board, Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossSquares = getLineSquares(currentSquare);
            for (Square square : crossSquares) {
                if (board.canMoveTo(square, color)) {
                    movements.add(square);
                    movements.addAll(getLineMovements(board, square, numberMovements - 1));
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
        return new Square(square.x - 1, square.y, Color.VOID);
    }

    private Square getRightSquare(Square square) {
        return new Square(square.x + 1, square.y + 1, Color.VOID);
    }

    public Set<Square> getDiagonalMovements(Board board, Square square) {
        return getDiagonalMovements(board, square, numberOfMovements);
    }

    public Set<Square> getDiagonalMovements(Board board, Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossSquares = getDiagonalSquares(currentSquare);
            for (Square square : crossSquares) {
                if (board.canMoveTo(square, color)) {
                    movements.add(square);
                    movements.addAll(getDiagonalMovements(board, square, numberMovements - 1));
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
        return new Square(currentSquare.x + 1, currentSquare.y + 1, Color.VOID);
    }

    private Square getUpRightSquare(Square currentSquare) {
        return new Square(currentSquare.x - 1, currentSquare.y + 1, Color.VOID);
    }

    private Square getDownLeftSquare(Square currentSquare) {
        return new Square(currentSquare.x + 1, currentSquare.y - 1, Color.VOID);
    }

    private Square getDownRightSquare(Square currentSquare) {
        return new Square(currentSquare.x - 1, currentSquare.y - 1, Color.VOID);
    }
    }

    public ArrayList<Square> getLazyLineAndDiagonalMovements(Square square, int numberMovements) {
        ArrayList<Square> movements = new ArrayList<>();
        if (numberMovements == 1) {
            movements.addAll(getLazyDiagonalMovements(square, numberMovements));
            movements.addAll(getLazyLineMovements(square, numberMovements));
        } else {
            ArrayList<Square> upMovements = getLazyLineAndDiagonalMovements(new Square(square.x, square.y + 1, square.color), numberMovements - 1);
            ArrayList<Square> downMovements = getLazyLineAndDiagonalMovements(new Square(square.x, square.y - 1, square.color), numberMovements - 1);
            ArrayList<Square> leftMovements = getLazyLineAndDiagonalMovements(new Square(square.x - 1, square.y, square.color), numberMovements - 1);
            ArrayList<Square> rightMovements = getLazyLineAndDiagonalMovements(new Square(square.x + 1, square.y + 1, square.color), numberMovements - 1);
            ArrayList<Square> upRightMovements = getLazyLineAndDiagonalMovements(new Square(square.x + 1, square.y + 1, square.color), numberMovements - 1);
            ArrayList<Square> downRightMovements = getLazyLineAndDiagonalMovements(new Square(square.x + 1, square.y - 1, square.color), numberMovements - 1);
            ArrayList<Square> downLeftMovements = getLazyLineAndDiagonalMovements(new Square(square.x - 1, square.y - 1, square.color), numberMovements - 1);
            ArrayList<Square> upLeftMovements = getLazyLineAndDiagonalMovements(new Square(square.x - 1, square.y + 1, square.color), numberMovements - 1);
            movements.addAll(upMovements);
            movements.addAll(downMovements);
            movements.addAll(leftMovements);
            movements.addAll(rightMovements);
            movements.addAll(upRightMovements);
            movements.addAll(downRightMovements);
            movements.addAll(downLeftMovements);
            movements.addAll(upLeftMovements);
       }

        return movements;
    }
}
