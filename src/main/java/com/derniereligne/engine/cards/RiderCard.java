package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.HashSet;
import java.util.Set;

public class RiderCard extends Card {

    /**
     * Used to get the squares located at the right and left of the given square.
     *
     * @see ProbableSquaresGetter#get
     */
    private final ProbableSquaresGetter possibleHorizontalSquaresGetter;
    /**
     * Used to get the squares located above and below the given square.
     *
     * @see ProbableSquaresGetter#get
     */
    private final ProbableSquaresGetter possibleVerticalSquaresGetter;
    /**
     * Used to get the temporary squares located at the right the given square.
     *
     * With this method we are sure we won't step outside the arm we are in.
     *
     * @see TemporarySquareGetter#get
     */
    private final TemporarySquareGetter rightSquareGetter;
    /**
     * Used to get the temporary squares located at the left the given square.
     *
     * With this method we are sure we won't step outside the arm we are in.
     *
     * @see TemporarySquareGetter#get
     */
    private final TemporarySquareGetter leftSquareGetter;

    public RiderCard(Board board, Color color) {
        super(board, "Rider", 1, color);

        possibleVerticalSquaresGetter = (Square square) -> {
            return getPossibleVerticalSquares(square);
        };

        possibleHorizontalSquaresGetter = (Square square) -> {
            return getPossibleHorizontalSquares(square);
        };

        rightSquareGetter = (Square square) -> {
            return board.getRightSquare(square);
        };
        leftSquareGetter = (Square square) -> {
            return board.getLeftSquare(square);
        };
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = new HashSet<>();

        Set<Square> temporaryVerticalSquares = new HashSet<>();
        temporaryVerticalSquares.add(new Square(currentSquare.getX(), currentSquare.getY() + 2, Color.WHITE));
        temporaryVerticalSquares.add(new Square(currentSquare.getX(), currentSquare.getY() - 2, Color.WHITE));

        Set<Square> temporaryHorizontalSquares = getTemporaryHorizontalSquares(currentSquare);

        filterTemporarySquares(possibleMovements, temporaryHorizontalSquares, possibleHorizontalSquaresGetter);
        filterTemporarySquares(possibleMovements, temporaryVerticalSquares, possibleVerticalSquaresGetter);

        return possibleMovements;
    }

    private Set<Square> getTemporaryHorizontalSquares(Square currentSquare) {
        Set<Square> temporarySquares = new HashSet<>();

        temporarySquares.addAll(getTemporaryHorizontalSquaresOnOneSide(currentSquare, leftSquareGetter));
        temporarySquares.addAll(getTemporaryHorizontalSquaresOnOneSide(currentSquare, rightSquareGetter));

        return temporarySquares;
    }

    private Set<Square> getTemporaryHorizontalSquaresOnOneSide(Square currentSquare, TemporarySquareGetter temporarySquareGetter) {
        Set<Square> temporarySquares = new HashSet<>();

        Square temporarySquare = temporarySquareGetter.get(currentSquare);
        if (temporarySquare != null) {
            temporarySquare = temporarySquareGetter.get(temporarySquare);
            if (temporarySquare != null) {
                temporarySquares.add(new Square(temporarySquare.getX(), temporarySquare.getY(), cardColor));
            }
        }

        return temporarySquares;
    }

    private void filterTemporarySquares(Set<Square> possibleMovements, Set<Square> temporarySquares,
            ProbableSquaresGetter probableSquaresGetter) {
        for (Square temporarySquare : temporarySquares) {
            Set<Square> possibleSquares = probableSquaresGetter.get(temporarySquare);

            add(possibleSquares, possibleMovements);
        }
    }

    private Set<Square> getPossibleVerticalSquares(Square temporarySquare) {
        Set<Square> squares = new HashSet<>();
        squares.add(board.getLeftSquare(temporarySquare, possibleSquaresColor));
        squares.add(board.getRightSquare(temporarySquare, possibleSquaresColor));

        return squares;
    }

    private Set<Square> getPossibleHorizontalSquares(Square temporarySquare) {
        Set<Square> squares = new HashSet<>();
        squares.add(board.getUpSquare(temporarySquare, possibleSquaresColor));
        squares.add(board.getDownSquare(temporarySquare, possibleSquaresColor));

        return squares;
    }

    private void add(Set<Square> possibleSquares, Set<Square> possibleMovements) {
        for (Square square : possibleSquares) {
            if (square != null) {
                addSquareIfEmpty(possibleMovements, square);
            }
        }
    }

}
