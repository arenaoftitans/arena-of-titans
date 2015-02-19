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
    private static final int MAX_PLAYER = 8;
    private final Player host;
    private final Slot[] slots;
    private final String lobbyId = new BigInteger(100, new SecureRandom()).toString(32);
    private final String invitId = new BigInteger(100, new SecureRandom()).toString(32);

    public Lobby(Player host) {
        this.host = host;
        slots = new Slot[MAX_PLAYER];
        slots[0] = new Slot(host);
        for (int i=1; i < MAX_PLAYER; i++) {
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

    public boolean addPublicPlayer(Player player) {
        for (int i=0; i < MAX_PLAYER; i++) {
            if (slots[i].isOpened()) {
                slots[i].setPlayer(player);
                return true;
            }
        }
        return false;
    }

    public boolean addInvitedPlayer(Player player) {
        for (int i = 0; i < MAX_PLAYER; i++) {
            if (slots[i].isReserved()) {
                slots[i].setPlayer(player);
                return true;
            }
        }
        return false;
    }

    public String getLobbyId() {
        return lobbyId;
    }

    public String getInvitId() {
        return invitId;
    }
}
