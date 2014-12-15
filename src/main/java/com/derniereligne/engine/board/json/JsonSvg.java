package com.derniereligne.engine.board.json;

import java.util.List;
import java.util.Map;

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
    private Map<String, String> fill;
    private List<List<Map<String, String>>> lines;

    public String getRotationCenter() {
        return rotationCenter;
    }

    public String getFillOrigin() {
        return fillOrigin;
    }

    public Map<String, String> getFill() {
        return fill;
    }

    public List<List<Map<String, String>>> getLines() {
        return lines;
    }

}
