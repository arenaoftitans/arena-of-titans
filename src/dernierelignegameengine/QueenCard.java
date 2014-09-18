/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dernierelignegameengine;

import java.util.Set;

/**
 *
 * @author jenselme
 */
public class QueenCard extends Card {

    public QueenCard(Board board, Color color) {
        super(board, "Queen", 3, color);

    }

    @Override
    public Set<Square> getPossibleMovements(Square currentSquare) {
        Set<Square> possibleMovements = getLineAndDiagonalMovements(currentSquare);

        return possibleMovements;
    }
}
