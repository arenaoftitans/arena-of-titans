package com.derniereligne.engine.trumps;

import com.derniereligne.engine.Player;

/**
 * Mother class of all trump cards.
 *
 * It contains all common attributes and methods of the the trump cards.
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public abstract class Trump {

    /**
     * The name of the trump card.
     */
    protected String name;
    /**
     * The number of turn this trump card lasts.
     */
    protected int duration;
    /**
     * The description of the effect of this trump card.
     */
    protected String description;
    /**
     * The cost of this trump card.
     */
    protected int cost;
    /**
     * If true, then this trump must be applied to another player.
     */
    protected boolean mustTargetPlayer;

    public Trump(String name, int duration, String description, int cost, boolean mustTargetPlayer) {
        this.name = name;
        this.duration = duration;
        this.description = description;
        this.cost = cost;
        this.mustTargetPlayer = mustTargetPlayer;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Use this card for or against a specific player.
     *
     * @param player The player on which the card affects.
     */
    public abstract void affect(Player player);

    public int getDuration() {
        return duration;
    }

    /**
     * Decrease the duration by 1.
     *
     * This method must be used each time the trump card is played so it lasts exactly the number of
     * turn it is design to last.
     *
     * TODO: make this method protected so we are sure it is correctly used.
     */
    public void consume() {
        duration--;
    }

    public boolean mustTargetPlayer() {
        return mustTargetPlayer;
    }

}