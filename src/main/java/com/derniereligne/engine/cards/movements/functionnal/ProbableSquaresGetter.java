package com.derniereligne.engine.cards.movements.functionnal;

import com.derniereligne.engine.board.Square;
import java.util.Set;

/**
 * <b>Interface used to to abstract the way we get probable squares from the board.</b>
 *
 * @author "Dernière Ligne" first development team
 */
@FunctionalInterface
public interface ProbableSquaresGetter {

    /**
     * <b>Returns the set of the probable squares.</b>
     *
     * @param currentSquare
     *        The start square.
     *
     * @return
     *        Set of probable squares.
     */
    public Set<Square> get(Square currentSquare);

}
