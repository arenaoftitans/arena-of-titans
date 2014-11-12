package com.derniereligne.engine;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Used by gson to represent a specific board from JSON to SVG.
 *
 * Its setters and getters ease the creation of a Board.
 *
 * @author jenselme
 */
public class JsonSvg {

    private String rotationCenter;
    private String fillOrigin;
    private HashMap<String, String> fill;
    private List<List<HashMap<String, String>>> lines;

    /**
     * Returns the matrix representing the color of the board.
     *
     * @param boardName
     * @return
     */
    public List<List<Color>> getColorDisposition(String[] circleColors, String[] armColors, int numberArms) {
        List<List<Color>> disposition = new ArrayList<>();

        for (String partialLine : circleColors) {
            appendLineDisposition(disposition, partialLine, numberArms / 2 - 1);
        }

        for (String partialLine : armColors) {
            appendLineDisposition(disposition, partialLine, numberArms - 1);
        }

        return disposition;
    }

    private void appendLineDisposition(List<List<Color>> disposition, String partialLine,
            int numberTimeToRepeatPartialLine) {
        String compleLineString = partialLine;
        for (int i = 0; i < numberTimeToRepeatPartialLine; i++) {
            compleLineString = compleLineString + "," + partialLine;
        }

        String[] completeLine = compleLineString.split(",");
        List<Color> completeColorLine = new ArrayList<>();
        for (String color : completeLine) {
            completeColorLine.add(getColor(color));
        }

        disposition.add(completeColorLine);
    }

    private Color getColor(String colorName) {
        switch (colorName) {
            case "BLACK":
                return Color.BLACK;
            case "BLUE":
                return Color.BLUE;
            case "RED":
                return Color.RED;
            case "YELLOW":
                return Color.YELLOW;
            default:
                return Color.ALL;
        }
    }

    public String getRotationCenter() {
        return rotationCenter;
    }

    public String getFillOrigin() {
        return fillOrigin;
    }

    public HashMap<String, String> getFill() {
        return fill;
    }

    public List<List<HashMap<String, String>>> getLines() {
        return lines;
    }

}
