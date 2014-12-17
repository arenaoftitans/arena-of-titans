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
    private Color[] removedColors;

    public RemovingColorTrumpCard(String name, int duration, String description,
            int cost, Color... colors) {
        super(name, duration, description, cost);
        if (colors[0].equals(Color.ALL)) {
            removedColors = Color.values();
        } else {
            removedColors = colors;
        }
    }

    @Override
    public void affect(Player player) {
        for (Color color : removedColors) {
            player.getDeck().removePossibleColorFromHand(color);
        }
    }

}
