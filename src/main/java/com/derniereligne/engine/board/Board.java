package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import com.google.gson.Gson;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;

//TODO: Width and height contained in the board ?
public class Board {
    private final int WIDTH;
    private final int HEIGHT;
    private final Square[][] board;
    private final int INNER_CIRCLE_HIGHER_Y;
    private final int ARMS_WIDTH;
    private static final String jsonFileName = "/com/derniereligne/engine/board/boards.json";

    public Board() {
        this("standard_board");
    }

    public Board(String boardName) {
        try {
            URI resource = getClass().getResource(jsonFileName).toURI();
            String jsonString = FileUtils.readFileToString(new File(resource));

            // We must correct the json we get from the file in order for gson
            // to find the correct key and to correctly map the boards to their
            // representation.
            jsonString = "{\"boards\":" + jsonString + "}";

            Gson gson = new Gson();
            JsonGame jsonGame = gson.fromJson(jsonString, JsonGame.class);
            JsonBoard jsonBoard = jsonGame.get(boardName);

            // Initialize the board.
            WIDTH = jsonBoard.getWidth();
            HEIGHT = jsonBoard.getHeight();
            INNER_CIRCLE_HIGHER_Y = jsonBoard.getInnerCircleHigherY();
            ARMS_WIDTH = jsonBoard.getArmsWidth();
            board = jsonBoard.getBoard(boardName);
        } catch (IOException | URISyntaxException ex) {
            Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    /**
     * Get the square located at (x,y)
     * @param x
     * @param y
     * @return Square@x,y
     */
    public Square getSquare(int x, int y) {
        return board[y][x];
    }

    /**
     * Make sure that the abscissa is contained in the board.
     *
     * Since the board is a circle represented in a matrix, we need to perform
     * those operation with %WIDTH. If the abscissa is negative, we adjust it so
     * it is becomes positive.
     * @param x
     * @return
     */
    public int correctAbs(int x) {
        while (x < 0) {
            x += WIDTH;
        }

        return x % WIDTH;
    }

    /**
     * Get the array of the squares on which we can move if we do a Up/Down or
     * Left/Right movement.
     * @param currentSquare
     * @param possibleSquaresColor
     * @return
     */
    public Square[] getLineSquares(Square currentSquare, Set<Color> possibleSquaresColor) {
        Square[] crossSquares = new Square[4];

        crossSquares[0] = getUpSquare(currentSquare, possibleSquaresColor);
        crossSquares[1] = getDownSquare(currentSquare, possibleSquaresColor);
        crossSquares[2] = getLeftSquare(currentSquare, possibleSquaresColor);
        crossSquares[3] = getRightSquare(currentSquare, possibleSquaresColor);

        return crossSquares;
    }

    private Square getUpSquare(Square square, Set<Color> possibleSquaresColor) {
        return returnSquareIfCanMoveToNullOtherwise(square.getX(), square.getY() + 1, possibleSquaresColor);
    }

    private Square returnSquareIfCanMoveToNullOtherwise(int x, int y, Set<Color> possibleSquaresColor) {
        if (canMoveTo(x, y, possibleSquaresColor)) {
            return getSquare(x, y);
        } else {
            return null;
        }
    }

    /**
     * Check that we can move to the square located at (x, y).
     *
     * Check that x and y are in the board  and that the color is correct.
     * @param x
     * @param y
     * @param possibleSquaresColor
     * @return boolean
     */
    private boolean canMoveTo(int x, int y, Set<Color> possibleSquaresColor) {
        return x < WIDTH && y >= 0 && y < HEIGHT && board[y][x].canMoveTo(possibleSquaresColor);
    }

    private Square getDownSquare(Square square, Set<Color> possibleSquaresColor) {
        return returnSquareIfCanMoveToNullOtherwise(square.getX(), square.getY() - 1, possibleSquaresColor);
    }

    /**
     * If the square is on the left edge and in an arm, we cannot move to the
     * square at its left (x-1). If we are not in an arm, we must correct the x
     * coordinate.
     * @param square
     * @param possibleSquaresColor
     * @return Square
     */
    public Square getLeftSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onLeftEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.getX() - 1);
            int y = square.getY();
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    /**
     * Returns true if square is located in an arm.
     * @param square
     * @return boolean
     */
    private boolean isInArm(Square square) {
        return square.getY() > INNER_CIRCLE_HIGHER_Y;
    }

    /**
     * Returns true if square is on a left Edge of an arm.
     * @param square
     * @return boolean
     */
    private boolean onLeftEdge(Square square) {
        return square.getX() % ARMS_WIDTH == 0;
    }

    public Square getRightSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onRightEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.getX() + 1);
            int y = square.getY();
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    /**
     * Returns true if square is on the right edge of an arm.
     * @param square
     * @return boolean
     */
    private boolean onRightEdge(Square square) {
        return square.getX() % ARMS_WIDTH == ARMS_WIDTH - 1;
    }

    /**
     * Returns the array of 4 squares on which we can move if we do diagonals
     * movements.
     * @param currentSquare
     * @param possibleSquaresColor
     * @return Square[]
     */
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
            int x = correctAbs(square.getX() - 1);
            int y = square.getY() - 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    /**
     * Returns true if square is at the upper edge of an arm.
     * @param square
     * @return boolean
     */
    private boolean onArmEdge(Square square) {
        return square.getY() == INNER_CIRCLE_HIGHER_Y + 1;
    }

    private Square getUpRightSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onRightEdge(square) && !onArmEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.getX() + 1);
            int y = square.getY() - 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    private Square getDownLeftSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onLeftEdge(square) && !onCircleEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.getX() - 1);
            int y = square.getY() + 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    /**
     * Returns true if square is at the bottom edge of a square.
     * @param square
     * @return
     */
    private boolean onCircleEdge(Square square) {
        return square.getY() == INNER_CIRCLE_HIGHER_Y;
    }

    private Square getDownRightSquare(Square square, Set<Color> possibleSquaresColor) {
        if (isInArm(square) && onRightEdge(square) && !onCircleEdge(square)) {
            return null;
        } else {
            int x = correctAbs(square.getX() + 1);
            int y = square.getY() + 1;
            return returnSquareIfCanMoveToNullOtherwise(x, y, possibleSquaresColor);
        }
    }

    @Override
    public String toString() {
        return Arrays.deepToString(board);
    }
}
