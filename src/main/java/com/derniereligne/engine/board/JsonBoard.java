package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Used by gson to represent a specific board from JSON to Java.
 *
 * Its setters and getters ease the creation of a Board.
 * @author jenselme
 */
class JsonBoard {
    private int number_arms;
    private int arms_width;
    private String[] circle_colors;
    private String[] arm_colors;

    public int getInnerCircleHigherY() {
        return circle_colors.length - 1;
    }

    public int getHeight() {
        return circle_colors.length + arm_colors.length;
    }

    public int getWidth() {
        return number_arms * arms_width;
    }

    public int getArmsWidth() {
        return arms_width;
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
        String[][] disposition = getDisposition(boardName);

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                String colorName = disposition[i][j];
                Color color = getColor(colorName);
                board[i][j] = new Square(j, i, color);
            }
        }

        return board;
    }

    /**
     * Returns the matrix representing the color of the board.
     * @param boardName
     * @return
     */
    public String[][] getDisposition(String boardName) {
        int height = getHeight();
        int width = getWidth();
        String[][] disposition = new String[height][width];

        try {
            String fileName = boardName + "-colors";
            InputStreamReader resource = new InputStreamReader(getClass().getResourceAsStream(fileName));
            BufferedReader colorDispositionFile = new BufferedReader(resource);
            for (int i = 0; i < height; i++) {
                String line = colorDispositionFile.readLine();
                disposition[i] = line.split(",");
            }
        } catch (IOException ex) {
            Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, ex);
        }

        return disposition;
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
                return Color.WHITE;
        }
    }
}
