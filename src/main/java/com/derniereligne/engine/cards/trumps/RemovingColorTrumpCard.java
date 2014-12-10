/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards.trumps;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.Player;

/**
 *
 * @author gaussreload
 */
public class RemovingColorTrumpCard extends TrumpCard{
    private Color removedColor;

    public RemovingColorTrumpCard(String name, int duration, String description,
            int cost, Color color) {
        super(name, duration, description, cost);
        this.removedColor = color;
    }

    @Override
    public void affect(Player player) {
        player.getDeck().removePossibleColorFromHand(removedColor);
    }

}
