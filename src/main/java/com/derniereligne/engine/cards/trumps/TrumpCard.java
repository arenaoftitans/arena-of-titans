package com.derniereligne.engine.cards.trumps;

import com.derniereligne.engine.Player;

public abstract class TrumpCard {
    protected String name;
    protected int duration;
    protected String description;
    protected int cost;

    public TrumpCard(String name, int duration, String description, int cost) {
        this.name = name;
        this.duration = duration;
        this.description = description;
        this.cost = cost;
    }

    public abstract void affect(Player player);

    public int getDuration() {
        return duration;
    }

    public void consume() {
        duration --;
    }
}
