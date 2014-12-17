package com.derniereligne.engine.cards.movements;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public abstract class MovementsCard {

    /**
     * The name of the card.
     */
    protected final String name;
    /**
     * The color of the card.
     */
    protected final Color cardColor;
    /**
     * The set of colors on which the card can move. Some cards have more than one color.
     */
    protected Set<Color> possibleSquaresColor;
    /**
     * The maximum number of movements allowed for this card.
     */
    protected int numberOfMovements;
    /**
     * A reference to the game board, used to get possible movements.
     *
     * @see Card#getPossibleMovements(com.derniereligne.engine.board.Square)
     * @see Card#getPossibleMovements(com.derniereligne.engine.board.Square, int)
     */
    protected Board board;
    /**
     * Used to get the probable squares for a specific card.
     *
     * @see Card#Card(com.derniereligne.engine.board.Board, java.lang.String, int,
     * com.derniereligne.engine.Color, java.lang.String)
     */
    protected ProbableSquaresGetter probableSquaresGetter;
    /**
     * Used to get the Up, Down, Left and Right squares when we search the possible movements in
     * line.
     *
     * @see Board#getLineSquares(com.derniereligne.engine.board.Square, java.util.Set)
     */
    protected final ProbableSquaresGetter lineProbableSquaresGetter;
    /**
     * Used to get the Up Left, Up Right, Down Left, Down Right squares when we search the possible
     * movements in diagonal.
     *
     * @see Board#getDiagonalSquares(com.derniereligne.engine.board.Square, java.util.Set)
     */
    protected final ProbableSquaresGetter diagonalProbableSquaresGetter;
    /**
     * Used to get all the adjacent squares when we search the possible movements in line and
     * diagonal.
     *
     * @see Board#getLineSquares(com.derniereligne.engine.board.Square, java.util.Set)
     * @see Board#getDiagonalSquares(com.derniereligne.engine.board.Square, java.util.Set)
     */
    protected final ProbableSquaresGetter lineAndDiagonalProbableSquaresGetter;


    protected int defaultNumberOfMovements;
    protected Set<Color> defaultPossibleSquaresColor;

    /**
     * <b>Create a new card with the specified parameters.</b>
     *
     * @param board Reference to the board game.
     *
     * @param name The name of the card.
     *
     * @param numberOfMovements The maximum number of movements for the card.
     *
     * @param color The color of the card.
     *
     * @param addtionalMovementsColor The additional color a card can go to.
     */
    public MovementsCard(Board board, String name, int numberOfMovements, Color color, List<Color> addtionalMovementsColor) {
        this(board, name, numberOfMovements, color);

        if (addtionalMovementsColor != null) {
            possibleSquaresColor.addAll(addtionalMovementsColor);
            defaultPossibleSquaresColor.addAll(addtionalMovementsColor);
        }
    }
    /**
     * <b>Returns the possible colors where this card can land.</b>
     *
     * @return
     *      The possible colors where this card can land.
     */
    public Set<Color> getSquarePossibleColors() {
        return possibleSquaresColor;
    }

    /**
     * <b>Create a new card with the specified parameters.</b>
     *
     * @param board Reference to the board game.
     *
     * @param name The name of the card.
     *
     * @param numberOfMovements The maximum number of movements for the card.
     *
     * @param color The color of the card.
     */
    public MovementsCard(Board board, String name, int numberOfMovements, Color color) {
        this.board = board;
        this.name = name;
        this.numberOfMovements = numberOfMovements;
        this.defaultNumberOfMovements = numberOfMovements;
        this.cardColor = color;
        this.possibleSquaresColor = new HashSet<>();
        this.defaultPossibleSquaresColor = new HashSet<>();
        this.possibleSquaresColor.add(color);
        this.defaultPossibleSquaresColor.add(color);

        lineProbableSquaresGetter = (Square currentSquare) ->
            board.getLineSquares(currentSquare, possibleSquaresColor);
        diagonalProbableSquaresGetter = (Square currentSquare) ->
            board.getDiagonalSquares(currentSquare, possibleSquaresColor);
        lineAndDiagonalProbableSquaresGetter = (Square currentSquare) -> {
            Set<Square> possibleSquares = board.getDiagonalSquares(currentSquare, possibleSquaresColor);
            possibleSquares.addAll(board.getLineSquares(currentSquare, possibleSquaresColor));

            return possibleSquares;
        };
    }

    /**
     * <b>Returns the Set of the squares on which the card can go when the player is on
     * currentSquare.</b>
     *
     * @param currentSquare The square on which the player is when he plays the card.
     *
     * @return Set The set of all possible squares for this move.
     */
    public abstract Set<String> getPossibleMovements(Square currentSquare);

    /**
     * <b>Returns the Set of all possible squares if we move in lines.</b>
     *
     * @param square The square on which the player start.
     *
     * @return Set The set of all possible squares for this move.
     */
    protected Set<String> getLineMovements(Square square) {
        return getPossibleMovements(square, numberOfMovements);
    }

    /**
     * <b>Determines on which square we can go for the current iteration.</b>
     *
     * @param currentSquare The square on which we start the iteration.
     *
     * @param numberMovements The number of movement left at this iteration.
     *
     * @return Set The Set of possible squares (on which we can move).
     */
    private Set<String> getPossibleMovements(Square currentSquare, int numberMovements) {
        Set<String> movements = new HashSet<>();
        if (numberMovements > 0) {
            Set<Square> probableSquares = probableSquaresGetter.get(currentSquare);
            movements.addAll(getNextPossibleSquares(probableSquares, numberMovements));
        }
        return movements;
    }

    /**
     * <b>Select only the possible square among probable squares and then search all possible
     * movements starting at these squares.</b>
     *
     * @see Card#getPossibleMovements(com.derniereligne.engine.board.Square, int)
     *
     * @param probableSquares The set of all probable squares.
     *
     * @param numberMovements The number of movements left at this iteration.
     *
     * @return The set of all possible squares.
     */
    private Set<String> getNextPossibleSquares(Set<Square> probableSquares, int numberMovements) {
        Set<String> movements = new HashSet<>();

        for (Square square : probableSquares) {
            if (square != null) {
                addSquareIfEmpty(movements, square);
                movements.addAll(getPossibleMovements(square, numberMovements - 1));
            }
        }
        return movements;
    }

    /**
     * <b>If the square is not empty, we cannot move to it. Thus it must not be added the the
     * possible movements.</b>
     *
     * @param movements The Set of possible squares.
     *
     * @param square The square to check.
     */
    protected void addSquareIfEmpty(Set<String> movements, Square square) {
        if (!square.isOccupied()) {
            movements.add(square.getId());
        }
    }

    /**
     * Returns the Set of all possible squares if we move diagonally.
     *
     * @param square
     * @return Set
     */
    protected Set<String> getDiagonalMovements(Square square) {
        return getPossibleMovements(square, numberOfMovements);
    }

    /**
     * Returns the Set of all possible squares if we move diagonally and in lines.
     *
     * @param square
     * @return Set
     */
    protected Set<String> getLineAndDiagonalMovements(Square square) {
        return getPossibleMovements(square, numberOfMovements);
    }

    public void removePossibleColor(Color color) {
        possibleSquaresColor.remove(color);
    }

    public void revertToDefault() {
        numberOfMovements = defaultNumberOfMovements;
        possibleSquaresColor = defaultPossibleSquaresColor;
    }

    public String getName() {
        return name;
    }

    public Color getColor() {
        return cardColor;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 53 * hash + Objects.hashCode(this.name);
        hash = 53 * hash + Objects.hashCode(this.cardColor);
        hash = 53 * hash + Objects.hashCode(this.possibleSquaresColor);
        hash = 53 * hash + this.numberOfMovements;
        hash = 53 * hash + Objects.hashCode(this.probableSquaresGetter);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null || getClass() != obj.getClass()) {
           return false;
        } else {
            MovementsCard other = (MovementsCard) obj;
            boolean hasSameNameAndColor = name.equals(other.name) && cardColor.equals(other.cardColor);
            boolean hasSameAttributes = Objects.equals(possibleSquaresColor, other.possibleSquaresColor);
            return hasSameNameAndColor && hasSameAttributes;
        }
    }

    @Override
    public String toString() {
        return "MovementsCard{" + "name=" + name + ", cardColor=" + cardColor
                + ", possibleSquaresColor=" + possibleSquaresColor + ", numberOfMovements="
                + numberOfMovements + '}';
    }

}
