/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aot.engine.cards.movements.functionnal;

import com.aot.engine.board.Square;

/**
 * <b>Interface used to to abstract the way we get probable squares from the board.</b>
 *
 * @author "Dernière Ligne" first development team
 */
@FunctionalInterface
public interface TemporarySquareGetter {

    /**
     * <b>Returns a temporary square of a rider move in a specific direction (Up, Down, Left, Right).</b>
     *
     * @param square
     *        The start square.
     *
     * @return
     *        The temporary square.
     */
    public Square get(Square square);

}
