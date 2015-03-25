/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aot.engine.lobby;

import com.aot.engine.Player;

/**
 *
 * @author gaussreload
 */
public class Slot {
    private SlotState state;
    private Player player;

    public Slot(SlotState state) {
        this.state = state;
        this.player = null;
    }

    public Slot(Player player) {
        this.state = SlotState.CLOSED;
        this.player = player;
    }

    public boolean isOpened() {
        return (state.equals(SlotState.OPEN));
    }

    public boolean isReserved() {
        return (state.equals(SlotState.RESERVED));
    }

    public void setState(SlotState state) {
        this.state = state;
    }

    public void setPlayer(Player player) {
        this.player = player;
        state = SlotState.TAKEN;
    }
}
