package com.aot.engine.trumps;

import com.aot.engine.Player;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.util.Objects;

/**
 * Mother class of all trump cards.
 *
 * It contains all common attributes and methods of the the trump cards.
 *
 * @author "Arena of Titans" first development team
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
    protected boolean enabled;

    public Trump(String name, int duration, String description, int cost, boolean mustTargetPlayer, boolean enabled) {
        this.name = name;
        this.duration = duration;
        this.description = description;
        this.cost = cost;
        this.mustTargetPlayer = mustTargetPlayer;
        this.enabled = enabled;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void enable() {
        this.enabled = true;
    }

    public void disable() {
        this.enabled = false;
    }

    public boolean isEnabled() {
        return enabled;
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

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 23 * hash + Objects.hashCode(this.name);
        hash = 23 * hash + this.duration;
        hash = 23 * hash + Objects.hashCode(this.description);
        hash = 23 * hash + this.cost;
        hash = 23 * hash + (this.mustTargetPlayer ? 1 : 0);
        hash = 23 * hash + (this.enabled ? 1 : 0);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Trump other = (Trump) obj;
        if (!Objects.equals(this.name, other.name)) {
            return false;
        }
        if (this.duration != other.duration) {
            return false;
        }
        if (!Objects.equals(this.description, other.description)) {
            return false;
        }
        if (this.cost != other.cost) {
            return false;
        }
        if (this.mustTargetPlayer != other.mustTargetPlayer) {
            return false;
        }
        if (this.enabled != other.enabled) {
            return false;
        }
        return true;
    }

    //public abstract String toJson();
    public JsonElement toJson() {
        Gson gson = new Gson();
        JsonObject jsonTrump = gson.toJsonTree(this, this.getClass()).getAsJsonObject();
        jsonTrump.addProperty("java_type", this.getClass().toString());

        return jsonTrump;
    }

}
