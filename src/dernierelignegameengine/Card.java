package dernierelignegameengine;

import java.util.HashSet;
import java.util.Set;

/**
 * <b>Abstract class representating the general concept of a card.</b>
 * <div>
 *  This class will be used to generate all kind of cards.
 * </div>
 * 
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public abstract class Card {
    /**
     * This name is a generic name for the card.<br/>
     * To one kind of card corresponds one name.
     * 
     * @since 1.0
     */
    protected final String name;
    /**
     * This color is the one affected to the card.<br/>
     * A same kind of cards can exist in several colors.
     * 
     * @see Color
     * @since 1.0
     */
    protected final Color cardColor;
    /**
     * This represents all the possible colors that this card can cross.
     * 
     * @see Color
     * @since 1.0
     */
    protected final Set<Color> possibleSquaresColor = new HashSet<>();
    /**
     * Represents the number of cases that can be crossed by this card.
     * 
     * @since 1.0
     */
    protected final int numberOfMovements;
    /**
     * Represents the current board where this card will be played.
     * 
     * @since 1.0
     */
    protected Board board;

    /**
     * <b>Constructor initializing the name of the card, its cardColor,
     * the number of cases it can cross, the colors that it can cross and
     * the board where it will be played.</b>
     * <div>
     *  By default, the card will be able to cross only the cases with the same
     * color than its own.
     * </div>
     * 
     * @param board
     *          The board where this card can be played.
     * @param name
     *          The name of this card.
     * @param numberOfMovements
     *          The number of cases crossable by the card.
     * @param color 
     *          The color of this card
     * 
     * @version 1.0
     */
    public Card(Board board, String name, int numberOfMovements, Color color) {
        this.board = board;
        this.name = name;
        this.numberOfMovements = numberOfMovements;
        this.cardColor = color;
        this.possibleSquaresColor.add(color);
    }

    public abstract Set<Square> getPossibleMovements(Square currentSquare);

    protected Set<Square> getLineMovements(Square square) {
        return getLineMovements(square, numberOfMovements);
    }

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

    protected Set<Square> getDiagonalMovements(Square square) {
        return getDiagonalMovements(square, numberOfMovements);
    }

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

    protected Set<Square> getLineAndDiagonalMovements(Square currentSquare) {
        return getLineAndDiagonalMovements(currentSquare, numberOfMovements);
    }

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
