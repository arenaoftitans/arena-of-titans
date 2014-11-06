package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.HashSet;
import java.util.Set;

public abstract class Card {

    protected final String name;
    protected final Color cardColor;
    protected final Set<Color> possibleSquaresColor;
    protected final int numberOfMovements;
    protected Board board;
    protected ProbableSquaresGetter probableSquaresGetter;

    public Card(Board board, String name, int numberOfMovements, Color color) {
        this.board = board;
        this.name = name;
        this.numberOfMovements = numberOfMovements;
        this.cardColor = color;
        this.possibleSquaresColor = new HashSet<>();
        this.possibleSquaresColor.add(color);
    }

    /**
     * Returns the Set of the squares on which the card can go when the player is
     * on currentSquare.
     * @param currentSquare
     * @return Set
     */
    public abstract Set<Square> getPossibleMovements(Square currentSquare);

    /**
     * Returns the Set of all possible squares if we move in lines.
     * @param square
     * @return Set
     */
    protected Set<Square> getLineMovements(Square square) {
        probableSquaresGetter = (Square currentSquare) -> {
            return board.getLineSquares(currentSquare, possibleSquaresColor);
        };
        return getPossibleMovements(square, numberOfMovements);
    }

    /**
     * <b>Determines on which square we can go for the current iteration.</b>
     *
     * @param currentSquare
     *        The square on which we start the iteration.
     *
     * @param numberMovements
     *        The number of movement left at this iteration.
     *
     * @return
     *         The Set of possible squares (on which we can move).
     */
    private Set<Square> getPossibleMovements(Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Set<Square> probableSquares = probableSquaresGetter.get(currentSquare);
            movements.addAll(getNextPossibleSquares(probableSquares, numberMovements));
        }
        return movements;
    }

    /**
     * <b>Select only the possible square among probable squares and then search
     * all possible movements starting at these squares.</b>
     *
     * @see Card#getPossibleMovements(com.derniereligne.engine.board.Square, int)
     *
     * @param probableSquares
     *        The set of all probable squares.
     *
     * @param numberMovements
     *        The number of movements left at this iteration.
     *
     * @return
     *         The set of all possible squares.
     */
    private Set<Square> getNextPossibleSquares(Set<Square> probableSquares, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        for (Square square : probableSquares) {
            if (square != null) {
                addSquareIfEmpty(movements, square);
                movements.addAll(getPossibleMovements(square, numberMovements - 1));
            }
        }
        return movements;
    }

    /**
     * <b>If the square is not empty, we cannot move to it. Thus it must not be
     * added the the possible movements.</b>
     *
     * @param movements
     *        The Set of possible squares.
     *
     * @param square
     *        The square to check.
     */
    protected void addSquareIfEmpty(Set movements, Square square) {
        if (!square.isOccupied()) {
            movements.add(square);
        }
    }

    /**
     * Returns the Set of all possible squares if we move diagonally.
     * @param square
     * @return Set
     */
    protected Set<Square> getDiagonalMovements(Square square) {
        probableSquaresGetter = (Square currentSquare) -> {
            return board.getDiagonalSquares(currentSquare, possibleSquaresColor);
        };
        return getPossibleMovements(square, numberOfMovements);
    }

    /**
     * Returns the Set of all possible squares if we move diagonally and in lines.
     * @param currentSquare
     * @return Set
     */
    protected Set<Square> getLineAndDiagonalMovements(Square square) {
        probableSquaresGetter = (Square currentSquare) -> {
            Set<Square> possibleSquares = board.getDiagonalSquares(currentSquare, possibleSquaresColor);
            possibleSquares.addAll(board.getLineSquares(currentSquare, possibleSquaresColor));

            return possibleSquares;
        };

        return getPossibleMovements(square, numberOfMovements);
    }

}
