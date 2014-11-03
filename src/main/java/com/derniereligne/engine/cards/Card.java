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
        return getLineMovements(square, numberOfMovements);
    }

    /**
     * Returns the Set of all possible squares if we move in lines at this recursion.
     * @param currentSquare
     * @param numberMovements
     * @return Set
     */
    private Set<Square> getLineMovements(Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossSquares = board.getLineSquares(currentSquare, possibleSquaresColor);
            for (Square square : crossSquares) {
                if (square != null) {
                    movements.add(square);
                    movements.addAll(getLineMovements(square, numberMovements - 1));
                }
            }
       }
        return movements;
    }

    /**
     * Returns the Set of all possible squares if we move diagonally.
     * @param square
     * @return Set
     */
    protected Set<Square> getDiagonalMovements(Square square) {
        return getDiagonalMovements(square, numberOfMovements);
    }

    /**
     * Return the Set of all possible squares if we move diagonally at this recursion.
     * @param currentSquare
     * @param numberMovements
     * @return
     */
    private Set<Square> getDiagonalMovements(Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossSquares = board.getDiagonalSquares(currentSquare, possibleSquaresColor);
            for (Square square : crossSquares) {
                if (square != null) {
                    movements.add(square);
                    movements.addAll(getDiagonalMovements(square, numberMovements - 1));
                }
            }
       }

        return movements;
    }

    /**
     * Returns the Set of all possible squares if we move diagonally and in lines.
     * @param currentSquare
     * @return Set
     */
    protected Set<Square> getLineAndDiagonalMovements(Square currentSquare) {
        return getLineAndDiagonalMovements(currentSquare, numberOfMovements);
    }

    /**
     * Returns the Set of all possible squares if we move diagonally and in lines
     * at this recursion.
     * @param currentSquare
     * @param numberMovements
     * @return Set
     */
    private Set<Square> getLineAndDiagonalMovements(Square currentSquare, int numberMovements) {
        Set<Square> movements = new HashSet<>();
        if (numberMovements > 0) {
            Square[] crossLineSquares = board.getLineSquares(currentSquare, possibleSquaresColor);
            for (Square square : crossLineSquares) {
                if (square != null) {
                    movements.add(square);
                    movements.addAll(getLineAndDiagonalMovements(square, numberMovements - 1));
                }
            }

            Square[] crossDiagSquares = board.getDiagonalSquares(currentSquare, possibleSquaresColor);
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
