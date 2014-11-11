package com.derniereligne.engine;

import com.derniereligne.engine.board.Square;
import com.google.gson.annotations.SerializedName;
import java.util.List;

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

    /**
     * Return the matrix representing the board in Java for the game engine.
     * @param boardName
     * @return
     */
    public Square[][] getBoard(String boardName) {
        int height = getHeight();
        int width = getWidth();
        Square[][] board = new Square[height][width];
        System.out.println(jsonSvg);
        List<List<Color>> disposition = jsonSvg.getColorDisposition(circleColors, armColors, numberArms);

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                Color color = disposition.get(i).get(j);
                board[i][j] = new Square(j, i, color);
            }
        }

        return board;
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
