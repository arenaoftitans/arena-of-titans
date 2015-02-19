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
    private SlotStateEnum state;
    private Player player;

    public Slot(SlotStateEnum state) {
        this.state = state;
        this.player = null;
    }

    public Slot(Player player) {
        this.state = SlotStateEnum.CLOSED;
        this.player = player;
    }

    public boolean isOpened() {
        return (state.equals(SlotStateEnum.OPEN));
    }

    public boolean isReserved() {
        return (state.equals(SlotStateEnum.RESERVED));
    }

    public void setState(SlotStateEnum state) {
        this.state = state;
    }

    public void setPlayer(Player player) {
        this.player = player;
        state = SlotStateEnum.TAKEN;
    }
}
