/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.cards.trumps;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.Player;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;

/**
 *
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public class RemovingColorTrumpCard extends TrumpCard {

    private final EnumSet<Color> removedColors;

    public RemovingColorTrumpCard(String name, int duration, String description,
            int cost, Color... colors) {
        super(name, duration, description, cost);
        removedColors = EnumSet.noneOf(Color.class);
        List<Color> colorsAsList = Arrays.asList(colors);
        if (colorsAsList.contains(Color.ALL)) {
            removedColors.addAll(Arrays.asList(Color.values()));
        } else {
            removedColors.addAll(colorsAsList);
        }
    }

    @Override
    public void affect(Player player) {
        removedColors.parallelStream().forEach((color) -> {
            player.getDeck().removePossibleColorFromHand(color);
        });
    }

}
