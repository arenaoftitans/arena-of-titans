package com.derniereligne.engine.cards.trumps;

import com.derniereligne.engine.Player;

public class AddingTurnTrumpCard extends TrumpCard{
    private int turnsToAdd;

    public AddingTurnTrumpCard(String name, int duration, String description,
            int cost, int turnsToAdd) {
        this.name = name;
        this.duration = duration;
        this.description = description;
        this.cost = cost;
        this.turnsToAdd = turnsToAdd;
    }

    @Override
    public void affect(Player player) {
        if (player != null && duration > 0) {
            player.addToNumberMoveToPlay(turnsToAdd);
        }
    }
}
