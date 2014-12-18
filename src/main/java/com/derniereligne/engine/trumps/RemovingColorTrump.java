/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.trumps;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.Player;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;

/**
 * This kind of trump card prevents the player to move on some colors.
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public class RemovingColorTrump extends Trump {

    /**
     * The set of colors on which the player is not allowed to move to.
     */
    private final EnumSet<Color> removedColors;

    public RemovingColorTrump(String name, int duration, String description,
            int cost, boolean mustTargetPlayer, Color... colors) {
        super(name, duration, description, cost, mustTargetPlayer);
        // Create an empty EnumSet so we can use addAll to add the colors.
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
