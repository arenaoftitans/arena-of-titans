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

    public ArrayList<Square> getLazyDiagonalMovements(Square square) {
        return getLazyDiagonalMovements(square, numberOfMovements);
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
    }

    public ArrayList<Square> getLazyDiagonalMovements(Square square, int numberMovements) {
        ArrayList<Square> movements = new ArrayList<>();
        if (numberMovements == 1) {
            movements.add(new Square(square.x + 1, square.y + 1, square.color));
            movements.add(new Square(square.x + 1, square.y - 1, square.color));
            movements.add(new Square(square.x - 1, square.y - 1, square.color));
            movements.add(new Square(square.x - 1, square.y + 1, square.color));
        } else {
            ArrayList<Square> upRightMovements = getLazyLineMovements(new Square(square.x + 1, square.y + 1, square.color), numberMovements - 1);
            ArrayList<Square> downRightMovements = getLazyLineMovements(new Square(square.x + 1, square.y - 1, square.color), numberMovements - 1);
            ArrayList<Square> downLeftMovements = getLazyLineMovements(new Square(square.x - 1, square.y - 1, square.color), numberMovements - 1);
            ArrayList<Square> upLeftMovements = getLazyLineMovements(new Square(square.x - 1, square.y + 1, square.color), numberMovements - 1);
            movements.addAll(upRightMovements);
            movements.addAll(downRightMovements);
            movements.addAll(downLeftMovements);
            movements.addAll(upLeftMovements);
       }

        return movements;
    }

    public ArrayList<Square> getLazyLineAndDiagonalMovements(Square square) {
        return getLazyLineAndDiagonalMovements(square, numberOfMovements);
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
