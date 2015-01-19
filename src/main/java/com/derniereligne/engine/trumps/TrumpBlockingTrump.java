/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.trumps;

import com.derniereligne.engine.Player;

/**
 *
 * @author gaussreload
 */
public class TrumpBlockingTrump extends Trump{
    private String disabledTrump;

    public TrumpBlockingTrump(String name, int duration, String description, int cost, boolean mustTargetPlayer, String disabledTrump) {
        super(name, duration, description, cost, mustTargetPlayer, true);
        this.disabledTrump = disabledTrump;
    }

    @Override
    public void affect(Player player) {
        player.disableAffectingTrumpName(disabledTrump);
    }

}
