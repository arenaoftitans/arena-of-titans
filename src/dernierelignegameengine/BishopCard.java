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
public class BishopCard extends Card {

    public BishopCard(Color color) {
        super("Bishop", 2, color);

    }

    @Override
    public Set<Square> getPossibleMovements(Board board, Square currentSquare) {
        Set<Square> possibleMovements = getDiagonalMovements(board, currentSquare);

        return possibleMovements;
    }

}
