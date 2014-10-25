/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import java.util.Set;

/**
 *
 * @author jenselme
 */
public class QueenCard extends Card {
    public QueenCard(Board board, Color color) {
        super(board, "Queen", 2, color);

    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = getLineAndDiagonalMovements(currentSquare);

        return possibleMovements;
    }
}
