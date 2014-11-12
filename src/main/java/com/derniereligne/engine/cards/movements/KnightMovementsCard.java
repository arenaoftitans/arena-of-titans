package com.derniereligne.engine.cards.movements;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class KnightMovementsCard extends MovementsCard {

    /**
     * Used to get the squares located at the right and left of the given square.
     *
     * @see ProbableSquaresGetter#get
     */
    private final ProbableSquaresGetter possibleHorizontalSquaresGetter = (Square square) -> {
            return getPossibleHorizontalSquares(square);
        };
    /**
     * Used to get the squares located above and below the given square.
     *
     * @see ProbableSquaresGetter#get
     */
    private final ProbableSquaresGetter possibleVerticalSquaresGetter = (Square square) -> {
            return getPossibleVerticalSquares(square);
        };
    /**
     * Used to get the temporary squares located at the right the given square.
     *
     * With this method we are sure we won't step outside the arm we are in.
     *
     * @see TemporarySquareGetter#get
     */
    private final TemporarySquareGetter rightSquareGetter = (Square square) -> {
            return board.getRightSquare(square);
        };
    /**
     * Used to get the temporary squares located at the left the given square.
     *
     * With this method we are sure we won't step outside the arm we are in.
     *
     * @see TemporarySquareGetter#get
     */
    private final TemporarySquareGetter leftSquareGetter = (Square square) -> {
            return board.getLeftSquare(square);
        };

    /**
     * <b>Creates a new Rider.</b>
     *
     * This card has very specific movements. Thus it doesn't use MovementsCard constructor with movementsType.
     *
     * @param board
     *        Reference to the board game.
     *
     * @param color
     *        The color of the card.
     */
    public KnightMovementsCard(Board board, String name, int numberOfMovements, Color color) {
        super(board, "Rider", 1, color);
    }

    public KnightMovementsCard(Board board, String name, int numberOfMovements, Color color, List<Color> addtionalMovementsColor) {
        super(board, name, numberOfMovements, color, addtionalMovementsColor);
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = new HashSet<>();

        Set<Square> temporaryVerticalSquares = new HashSet<>();
        temporaryVerticalSquares.add(new Square(currentSquare.getX(), currentSquare.getY() + 2, Color.ALL));
        temporaryVerticalSquares.add(new Square(currentSquare.getX(), currentSquare.getY() - 2, Color.ALL));

        Set<Square> temporaryHorizontalSquares = getTemporaryHorizontalSquares(currentSquare);

        possibleMovements.addAll(
                filterTemporarySquares(temporaryHorizontalSquares, possibleHorizontalSquaresGetter)
        );
        possibleMovements.addAll(
                filterTemporarySquares(temporaryVerticalSquares, possibleVerticalSquaresGetter)
        );

        return possibleMovements;
    }

    /**
     * <b>Returns the set of all temporary squares located at the left and the right of the current
     * square.</b>
     *
     * @see RiderCard#leftSquareGetter
     * @see RiderCard#rightSquareGetter
     * @see RiderCard#getTemporaryHorizontalSquaresOnOneSide(com.derniereligne.engine.board.Square, com.derniereligne.engine.cards.TemporarySquareGetter)
     *
     * @param currentSquare
     *        The start square.
     *
     * @return Set
     *         The set of all temporary squares located at the left and the right of the current square.
     */
    private Set<Square> getTemporaryHorizontalSquares(Square currentSquare) {
        Set<Square> temporarySquares = new HashSet<>();

        temporarySquares.addAll(getTemporaryHorizontalSquaresOnOneSide(currentSquare, leftSquareGetter));
        temporarySquares.addAll(getTemporaryHorizontalSquaresOnOneSide(currentSquare, rightSquareGetter));

        return temporarySquares;
    }

    /**
     * <b>Returns the set of the squares (2 max) from the current square.</b>
     *
     * @see TemporarySquareGetter#get
     *
     * @param currentSquare
     *        The start square.
     *
     * @param temporarySquareGetter
     *        The functional interface that get the horizontal square on the left or the right.
     *
     * @return
     *         The set of the squares (2 max) from the current square.
     */
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

    /**
     * <b>Returns only the possible squares on which we can move from a specific temporary square.</b>
     *
     * @param temporarySquares
     *        The temporary square used in the movement.
     *
     * @param probableSquaresGetter
     *        Functional interface thanks to which we can get the probable squares from the temporary
     * square.
     *
     * @return Set
     *         The possible squares.
     */
    private Set<Square> filterTemporarySquares(Set<Square> temporarySquares, ProbableSquaresGetter probableSquaresGetter) {
        Set<Square> possibleMovements = new HashSet<>();

        for (Square temporarySquare : temporarySquares) {
            Set<Square> possibleSquares = probableSquaresGetter.get(temporarySquare);

            add(possibleSquares, possibleMovements);
        }

        return possibleMovements;
    }

    /**
     * <b>The possible Up and Down squares from the temporary square.</b>
     *
     * @param temporarySquare
     *        The temporary square for this move.
     *
     * @return Set
     *         The possible Up and Down squares from the temporary square.
     */
    private Set<Square> getPossibleVerticalSquares(Square temporarySquare) {
        Set<Square> squares = new HashSet<>();
        squares.add(board.getLeftSquare(temporarySquare, possibleSquaresColor));
        squares.add(board.getRightSquare(temporarySquare, possibleSquaresColor));

        return squares;
    }

    /**
     * <b>The possible Left and Right squares from the temporary square.</b>
     *
     * @param temporarySquare
     *        The temporary square for this move.
     *
     * @return Set
     *         >The possible Left and Right squares from the temporary square.
     */
    private Set<Square> getPossibleHorizontalSquares(Square temporarySquare) {
        Set<Square> squares = new HashSet<>();
        squares.add(board.getUpSquare(temporarySquare, possibleSquaresColor));
        squares.add(board.getDownSquare(temporarySquare, possibleSquaresColor));

        return squares;
    }

    /**
     * <b>Add the possible squares to the possible movements if they are not null and not empty.</b>
     *
     * @param possibleSquares
     *        The set of all possible squares.
     *
     * @param possibleMovements
     *        The set of all possible movements.
     */
    private void add(Set<Square> possibleSquares, Set<Square> possibleMovements) {
        for (Square square : possibleSquares) {
            if (square != null) {
                addSquareIfEmpty(possibleMovements, square);
            }
        }
    }

}
