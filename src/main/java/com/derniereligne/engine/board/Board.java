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


public class Board {
    private final int WIDTH;
    private final int HEIGHT;
    private final Square[][] board;
    private final int INNER_CIRCLE_HIGHER_Y;
    private static final String jsonFileName = "/com/derniereligne/engine/board/boards.json";

    public Board() {
        this("standard_board");
    }

    public Board(String boardName) {
        try {
            URI resource = getClass().getResource(jsonFileName).toURI();
            String jsonString = FileUtils.readFileToString(new File(resource));
            jsonString = "{\"boards\":" + jsonString + "}";
            System.out.println(jsonString);
            Gson gson = new Gson();
            JsonGame jsonGame = gson.fromJson(jsonString, JsonGame.class);

            JsonBoard jsonBoard = jsonGame.get(boardName);
            WIDTH = jsonBoard.getWidth();
            HEIGHT = jsonBoard.getHeight();
            INNER_CIRCLE_HIGHER_Y = jsonBoard.getInnerCircleHigherY();
            board = jsonBoard.getBoard(boardName);
        } catch (IOException | URISyntaxException ex) {
            Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, ex);
            throw new ExceptionInInitializerError(ex);
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
