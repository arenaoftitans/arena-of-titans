/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aot.engine.lobby;

import com.aot.engine.Player;
import java.math.BigInteger;
import java.security.SecureRandom;

/**
 *
 * @author gaussreload
 */
public class Lobby {
    private final Player host;
    private final Slot[] slots;
    private final String lobbyId = new BigInteger(100, new SecureRandom()).toString(32);
    private final String invitId = new BigInteger(100, new SecureRandom()).toString(32);

    public Lobby(Player host) {
        this.host = host;
        slots = new Slot[8];
        slots[0] = new Slot(host);
        for (int i=1; i<=7; i++) {
            slots[i]=new Slot(SlotStateEnum.CLOSED);
        }
    }

    public Player getHost() {
        return host;
    }

    public void openSlot(int index) {
        slots[index].setState(SlotStateEnum.OPEN);
    }

    public void closeSlot(int index) {
        slots[index].setPlayer(null);
        slots[index].setState(SlotStateEnum.CLOSED);
    }

    public void reserveSlot(int index) {
        slots[index].setState(SlotStateEnum.RESERVED);
    }

    public void addPlayer(int index, Player player) {
        slots[index].setPlayer(player);
    }

    public String getLobbyId() {
        return lobbyId;
    }

    public String getInvitId() {
        return invitId;
    }
}
