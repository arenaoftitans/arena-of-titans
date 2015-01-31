package com.aot.engine.trumps;

import com.aot.engine.Player;

/**
 * This kind of trump card modify the number of moves (plus or minus) a player can make in a turn.
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public class ModifyNumberOfMovesInATurnTrump extends Trump{
    private final int deltaOfMoves;

    public ModifyNumberOfMovesInATurnTrump(String name, int duration, String description,
            int cost, boolean mustTargetPlayer, int deltaOfMoves) {
        super(name, duration, description, cost, mustTargetPlayer);
        this.deltaOfMoves = deltaOfMoves;
    }

    @Override
    public void affect(Player player) {
        if (player != null && duration > 0) {
            player.addToNumberMoveToPlay(deltaOfMoves);
        }
    }
}
