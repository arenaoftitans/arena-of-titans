package com.derniereligne.engine.cards;

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
     *
     * @param currentSquare
     * @return
     */
    public Set<Square> get(Square currentSquare);

}
