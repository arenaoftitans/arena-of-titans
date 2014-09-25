package dernierelignegameengine;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.Set;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;


public class Board {
    private final int WIDTH;
    private final int HEIGHT;
    private final Square[][] board;
    private final int INNER_CIRCLE_HIGHER_Y;

    public Board() {
        String jsonFileName = "standardGame.json";
        JSONParser parser = new JSONParser();

        try {
            BufferedReader jsonFile = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(jsonFileName)));
            JSONObject jsonGame = (JSONObject) parser.parse(jsonFile);
            JSONObject jsonBoard = (JSONObject) jsonGame.get("board");

            JSONArray circle = (JSONArray) jsonBoard.get("circle");
            JSONArray arm = (JSONArray) jsonBoard.get("arm");
            int numberOfArms = (int)(long) jsonBoard.get("number of arms");
            int armsWidth = (int)(long) jsonBoard.get("arms width");
            WIDTH = numberOfArms * armsWidth;
            HEIGHT = circle.size() + arm.size();
            INNER_CIRCLE_HIGHER_Y = circle.size() - 1;

            String[][] disposition = getDisposition(circle, arm, numberOfArms);

            board = new Square[HEIGHT][WIDTH];

            for (int i = 0; i < HEIGHT; i++) {
                for (int j = 0; j < WIDTH; j++) {
                    board[i][j] = new Square(j, i, getColor(disposition[i][j]));
                }
            }
        } catch (FileNotFoundException ex) {
            Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, ex);
            throw new ExceptionInInitializerError(ex);
        } catch (IOException | ParseException ex) {
            Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    private String[][] getDisposition(JSONArray circle, JSONArray arm, int numberOfArms) {
        String[][] disposition = new String[HEIGHT][WIDTH];

            for (int i = 0; i < circle.size(); i++) {
                String currentLine = (String) circle.get(i);
                String circleLine = currentLine;
                for (int j = 1; j < numberOfArms/2; j++) {
                    circleLine += "," + currentLine;
                }
                disposition[i] = circleLine.split(",");
            }

            for (int i = 0; i < arm.size(); i++) {
                String currentLine = (String) arm.get(i);
                String armLine = currentLine;
                for (int j = 1; j < numberOfArms; j++) {
                    armLine += "," + currentLine;
                }
                disposition[i + circle.size()] = armLine.split(",");
            }

        return disposition;
    }

    private Color getColor(String colorName) {
        switch(colorName) {
            case "BLACK": return Color.BLACK;
            case "BLUE": return Color.BLUE;
            case "RED": return Color.RED;
            case "YELLOW": return Color.YELLOW;
            default: return Color.WHITE;
        }
    }

    public void movePlayerTo(Player player, Square square) {
        int x = square.x;
        int y = square.y;

        Square squareToMoveTo = board[y][x];
        squareToMoveTo.movePlayerTo(player);
    }

    public Square getSquare(int x, int y) {
        return board[y][x];
    }

    public int correctAbs(int x) {
        while (x < 0) {
            x += WIDTH;
        }

        return x % WIDTH;
    }

    public Square[] getLineSquares(Square currentSquare, Color cardColor) {
        Square[] crossSquares = new Square[4];

        crossSquares[0] = getUpSquare(currentSquare, cardColor);
        crossSquares[1] = getDownSquare(currentSquare, cardColor);
        crossSquares[2] = getLeftSquare(currentSquare, cardColor);
        crossSquares[3] = getRightSquare(currentSquare, cardColor);

        return crossSquares;
    }

    private Square getUpSquare(Square square, Color color) {
        return returnSquareIfCanMoveToNullOtherwise(square.x, square.y + 1, color);
    }

    private Square returnSquareIfCanMoveToNullOtherwise(int x, int y, Color color) {
        if (canMoveTo(x, y, color)) {
            return getSquare(x, y);
        } else {
            return null;
        }
    }

    private boolean canMoveTo(int x, int y, Color cardColor) {
        return x < WIDTH && y >= 0 && y < HEIGHT && board[y][x].canMoveTo(cardColor);
    }

    private Square getDownSquare(Square square, Color color) {
        return returnSquareIfCanMoveToNullOtherwise(square.x, square.y - 1, color);
    }

    /**
     * If the square is on the left edge and in an arm, we cannot move to the
     * square at its left (x-1). If we are not in an arm, we must correct the x
     * coordinate.
     */
    private Square getLeftSquare(Square square, Color color) {
        if (isInArm(square) && onLeftEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x - 1);
            int y = square.y;
            return returnSquareIfCanMoveToNullOtherwise(x, y, color);
        }
    }

    private boolean isInArm(Square square) {
        return square.y > INNER_CIRCLE_HIGHER_Y;
    }

    private boolean onLeftEdge(Square square) {
        return square.x % 2 == 0;
    }

    private Square getRightSquare(Square square, Color color) {
        if (isInArm(square) && onRightEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x + 1);
            int y = square.y;
            return returnSquareIfCanMoveToNullOtherwise(x, y, color);
        }
    }

    private boolean onRightEdge(Square square) {
        return square.x % 2 == 1;
    }

    public Square[] getDiagonalSquares(Square currentSquare, Color cardColor) {
        Square[] crossSquares = new Square[4];

        crossSquares[0] = getUpLeftSquare(currentSquare, cardColor);
        crossSquares[1] = getUpRightSquare(currentSquare, cardColor);
        crossSquares[2] = getDownLeftSquare(currentSquare, cardColor);
        crossSquares[3] = getDownRightSquare(currentSquare, cardColor);

        return crossSquares;
    }

    private Square getUpLeftSquare(Square square, Color color) {
        if (isInArm(square) && onLeftEdge(square) && !onArmEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x - 1);
            int y = square.y - 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, color);
        }
    }

    private boolean onArmEdge(Square square) {
        return square.y == INNER_CIRCLE_HIGHER_Y + 1;
    }

    private Square getUpRightSquare(Square square, Color color) {
        if (isInArm(square) && onRightEdge(square) && !onArmEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x + 1);
            int y = square.y - 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, color);
        }
    }

    private Square getDownLeftSquare(Square square, Color color) {
        if (isInArm(square) && onLeftEdge(square) && !onCircleEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x - 1);
            int y = square.y + 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, color);
        }
    }

    private boolean onCircleEdge(Square square) {
        return square.y == INNER_CIRCLE_HIGHER_Y;
    }

    private Square getDownRightSquare(Square square, Color color) {
        if (isInArm(square) && onRightEdge(square) && !onCircleEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x + 1);
            int y = square.y + 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, color);
        }
    }
}
