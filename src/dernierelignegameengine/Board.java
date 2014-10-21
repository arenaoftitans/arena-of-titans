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
    private static final String jsonFileName = "boards.json";

    public Board() {
        this("test_board");
    }

    public Board(String boardName) {
        JSONParser parser = new JSONParser();

        try {
            BufferedReader jsonFile = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(jsonFileName)));
            JSONObject jsonGame = (JSONObject) parser.parse(jsonFile);
            JSONObject jsonBoard = (JSONObject) jsonGame.get(boardName);

            JSONArray circle = (JSONArray) jsonBoard.get("circle_colors");
            JSONArray arm = (JSONArray) jsonBoard.get("arm_colors");
            int numberOfArms = (int)(long) jsonBoard.get("number_arms");
            int armsWidth = (int)(long) jsonBoard.get("arms_width");
            WIDTH = numberOfArms * armsWidth;
            HEIGHT = circle.size() + arm.size();
            INNER_CIRCLE_HIGHER_Y = circle.size() - 1;

            String[][] disposition = getDisposition(boardName);

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

    private String[][] getDisposition(String boardName) {
        String[][] disposition = new String[HEIGHT][WIDTH];

        try {
            BufferedReader colorDispositionFile = new
                BufferedReader(new InputStreamReader(getClass().getResourceAsStream(boardName + "-colors")));
            for (int i = 0; i < HEIGHT; i++) {
                String line = colorDispositionFile.readLine();
                disposition[i] = line.split(",");
            }
        } catch (IOException ex) {
            Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, ex);
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

    public Square getSquare(int x, int y) {
        return board[y][x];
    }

    public int correctAbs(int x) {
        while (x < 0) {
            x += WIDTH;
        }

        return x % WIDTH;
    }

    public Square[] getLineSquares(Square currentSquare, Set<Color> possibleSquaresColor) {
        Square[] crossSquares = new Square[4];

        crossSquares[0] = getUpSquare(currentSquare, possibleSquaresColor);
        crossSquares[1] = getDownSquare(currentSquare, possibleSquaresColor);
        crossSquares[2] = getLeftSquare(currentSquare, possibleSquaresColor);
        crossSquares[3] = getRightSquare(currentSquare, possibleSquaresColor);

        return crossSquares;
    }

    private Square getUpSquare(Square square, Set<Color> possibleSquaresColor) {
        return returnSquareIfCanMoveToNullOtherwise(square.x, square.y + 1, possibleSquaresColor);
    }

    private Square returnSquareIfCanMoveToNullOtherwise(int x, int y, Set<Color> possibleSquaresColor) {
        if (canMoveTo(x, y, possibleSquaresColor)) {
            return getSquare(x, y);
        } else {
            return null;
        }
    }

    private boolean canMoveTo(int x, int y, Set<Color> possibleSquaresColor) {
        return x < WIDTH && y >= 0 && y < HEIGHT && board[y][x].canMoveTo(possibleSquaresColor);
    }

    private Square getDownSquare(Square square, Set<Color> possibleSquaresColor) {
        return returnSquareIfCanMoveToNullOtherwise(square.x, square.y - 1, possibleSquaresColor);
    }

    /**
     * If the square is on the left edge and in an arm, we cannot move to the
     * square at its left (x-1). If we are not in an arm, we must correct the x
     * coordinate.
     */
    public Square getLeftSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onLeftEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x - 1);
            int y = square.y;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    private boolean isInArm(Square square) {
        return square.y > INNER_CIRCLE_HIGHER_Y;
    }

    private boolean onLeftEdge(Square square) {
        return square.x % 2 == 0;
    }

    public Square getRightSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onRightEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x + 1);
            int y = square.y;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    private boolean onRightEdge(Square square) {
        return square.x % 2 == 1;
    }

    public Square[] getDiagonalSquares(Square currentSquare, Set<Color> possibleSquaresColor) {
        Square[] crossSquares = new Square[4];

        crossSquares[0] = getUpLeftSquare(currentSquare, possibleSquaresColor);
        crossSquares[1] = getUpRightSquare(currentSquare, possibleSquaresColor);
        crossSquares[2] = getDownLeftSquare(currentSquare, possibleSquaresColor);
        crossSquares[3] = getDownRightSquare(currentSquare, possibleSquaresColor);

        return crossSquares;
    }

    private Square getUpLeftSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onLeftEdge(square) && !onArmEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x - 1);
            int y = square.y - 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    private boolean onArmEdge(Square square) {
        return square.y == INNER_CIRCLE_HIGHER_Y + 1;
    }

    private Square getUpRightSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onRightEdge(square) && !onArmEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x + 1);
            int y = square.y - 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    private Square getDownLeftSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onLeftEdge(square) && !onCircleEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x - 1);
            int y = square.y + 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    private boolean onCircleEdge(Square square) {
        return square.y == INNER_CIRCLE_HIGHER_Y;
    }

    private Square getDownRightSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onRightEdge(square) && !onCircleEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.x + 1);
            int y = square.y + 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    @Override
    public String toString() {
        return Arrays.deepToString(board);
    }
}
