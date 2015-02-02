package com.aot.engine.board.json;

import com.google.gson.annotations.SerializedName;

/**
 * Used by gson to represent a specific board from JSON to Java.
 *
 * Its setters and getters ease the creation of a Board.
 * @author jenselme
 */
public class JsonBoard {
    private int numberArms;
    private int armsWidth;
    private int armsLength;
    private String[] circleColors;
    private String[] armColors;
    @SerializedName("svg")
    private JsonSvg jsonSvg;

    public int getInnerCircleHigherY() {
        return circleColors.length - 1;
    }

    public int getHeight() {
        return circleColors.length + armColors.length;
    }

    public int getWidth() {
        return numberArms * armsWidth;
    }

    public int getArmsWidth() {
        return armsWidth;
    }

    public int getNumberArms() {
        return numberArms;
    }

    public int getArmsLength() {
        return armsLength;
    }

    public String[] getCircleColors() {
        return circleColors;
    }

    public String[] getArmColors() {
        return armColors;
    }

    public JsonSvg getJsonSvg() {
        return jsonSvg;
    }

}
