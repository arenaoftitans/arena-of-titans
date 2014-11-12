package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
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
