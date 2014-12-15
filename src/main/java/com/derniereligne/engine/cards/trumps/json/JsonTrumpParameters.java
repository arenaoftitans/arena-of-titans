
package com.derniereligne.engine.cards.trumps.json;

import com.derniereligne.engine.Color;
import java.util.ArrayList;
import java.util.List;

public class JsonTrumpParameters {

    private String type;
    private int deltaOfMoves;
    private List<String> additionnalColors;

    public String getType() {
        return type;
    }

    public int getDeltaOfMoves() {
        return deltaOfMoves;
    }

    public Color[] getColors(Color currentColor) {
        List<Color> colors = new ArrayList<>();
        if (currentColor != null) {
            colors.add(currentColor);
        }

        if (additionnalColors != null) {
            additionnalColors.forEach(colorName -> colors.add(Color
                    .valueOf(colorName.toUpperCase())
            ));
        }

        return colors.toArray(new Color[colors.size()]);
    }

}
