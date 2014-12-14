package com.derniereligne.engine.cards.trumps;

import com.derniereligne.engine.Player;

public class ModifyNumberOfMovesInATurnTrumpCard extends TrumpCard{
    private final int turnsToAdd;

    public ModifyNumberOfMovesInATurnTrumpCard(String name, int duration, String description,
            int cost, int turnsToAdd) {
        super(name, duration, description, cost);
        this.turnsToAdd = turnsToAdd;
    }

    @Override
    public void affect(Player player) {
        if (player != null && duration > 0) {
            player.addToNumberMoveToPlay(turnsToAdd);
        }
    }
}
