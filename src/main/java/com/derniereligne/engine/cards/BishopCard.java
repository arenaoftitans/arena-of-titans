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
public class BishopCard extends Card {

    public BishopCard(Board board, Color color) {
        super(board, "Bishop", 2, color);

        switch(color) {
            case RED:
                possibleSquaresColor.add(Color.BLACK);
                break;
            case YELLOW:
                possibleSquaresColor.add(Color.RED);
                break;
            case BLUE:
                possibleSquaresColor.add(Color.YELLOW);
                break;
            case BLACK:
                possibleSquaresColor.add(Color.BLUE);
                break;
        }
    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = getDiagonalMovements(currentSquare);

        return possibleMovements;
    }

}
