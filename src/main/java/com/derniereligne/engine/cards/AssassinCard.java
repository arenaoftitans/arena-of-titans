
package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.Set;

/**
 * <b>Represents an assassin.</b>
 *
 * @version 1.0
 */
public class AssassinCard extends Card{
    /**
     * <b>Initialize the assassin card.</b>
     * <div>
     *  An assasin can move 2 squares in any straigth direction of its color.
     * </div>
     *
     * @param board
     *          The board this card is played on.
     * @param color
     *          The color of this card
     *
     * @see Board
     * @see Color
     *
     * @since 1.0
     */
    public AssassinCard(Board board, Color color) {
        super(board, "Assassin", 2, color);
    }

    /**
     * <b>Returns the possible movements of the assassin.</b>
     * <div>
     *  An assassin can go both in line and in diagonal.
     * </div>
     *
     * @param currentSquare
     *          The square where the player is when this card is played.
     *
     * @return
     *          The possible movements from this square with an assassin.
     *
     * @see Card#getLineAndDiagonalMovements(com.derniereligne.engine.board.Square)
     * @see Square
     *
     * @since 1.0
     */
    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        return getLineAndDiagonalMovements(currentSquare);
    }
}
