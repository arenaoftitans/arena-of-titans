package com.derniereligne.engine.cards.trumps.json;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.cards.trumps.ModifyNumberOfMovesInATurnTrump;
import com.derniereligne.engine.cards.trumps.RemovingColorTrump;
import com.derniereligne.engine.cards.trumps.Trump;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class TrumpFactory {

    private TrumpFactory() {
    }

    public static List<Trump> getTrumps(List<JsonTrump> jsonTrumps) {
        List<Trump> trumps = jsonTrumps.parallelStream()
                .filter(jsonTrump -> !jsonTrump.mustBeRepeatedForEachColor())
                .map(jsonTrump -> getTrump(jsonTrump, null))
                .collect(Collectors.toList());
        jsonTrumps.parallelStream()
                .filter(jsonTrump -> jsonTrump.mustBeRepeatedForEachColor())
                .forEach(jsonTrump -> trumps.addAll(repeatTrump(jsonTrump)));
        return trumps;
    }

    private static Trump getTrump(JsonTrump jsonTrump, Color currentColor) {
        String name = jsonTrump.getName();
        return getTrump(jsonTrump, name, currentColor);
    }

    private static Trump getTrump(JsonTrump jsonTrump, String name, Color currentColor) {
        String description = jsonTrump.getDescription();
        int duration = jsonTrump.getDuration();
        int cost = jsonTrump.getCost();
        boolean mustTargetPlayer = jsonTrump.mustTargetPlayer();
        JsonTrumpParameters jsonTrumpParameters = jsonTrump.getParameters();

        switch (jsonTrump.getType()) {
            case "ModifyNumberOfMovesInATurnTrump":
                return new ModifyNumberOfMovesInATurnTrump(name, duration, description, cost,
                        mustTargetPlayer, jsonTrumpParameters.getDeltaOfMoves());
            case "RemovingColorTrump":
                return new RemovingColorTrump(name, duration, description, cost, mustTargetPlayer,
                        jsonTrumpParameters.getColors(currentColor));
            default:
                return null;
        }
    }

    private static List<Trump> repeatTrump(JsonTrump jsonTrump) {
        List<Trump> colors = new ArrayList<>();
        for (Color color : Color.values()) {
            if (color != Color.ALL) {
                String name = String.format("%s %s", jsonTrump.getName(), color.toString());
                colors.add(getTrump(jsonTrump, name, color));
            }
        }

        return colors;
    }

}
