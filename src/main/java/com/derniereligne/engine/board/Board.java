package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

//TODO: Width and height contained in the board ?
public class Board {

    private final int width;
    private final int height;
    private final Square[][] gameBoard;
    private final int innerCircleHigherY;
    private final int armsWidth;

    public Board(int width, int height, int innerCircleHigherY, int armsWidth, Square[][] board) {
        this.width = width;
        this.height = height;
        this.innerCircleHigherY = innerCircleHigherY;
        this.armsWidth = armsWidth;
        this.gameBoard = board;
    }

    /**
     * Get the square located at (x,y)
     *
     * @param x
     * @param y
     * @return Square@x,y
     */
    public Square getSquare(int x, int y) {
        if (isInBoard(x, y)) {
            return gameBoard[y][x];
        } else {
            return null;
        }
    }

    /**
     * Make sure that the abscissa is contained in the board.
     *
     * Since the board is a circle represented in a matrix, we need to perform those operation with
     * %WIDTH. If the abscissa is negative, we adjust it so it is becomes positive.
     *
     * @param x
     * @return
     */
    public int correctAbs(int x) {
        int xToCorrect = x;

        while (xToCorrect <= 0) {
            xToCorrect += width;
        }

        return xToCorrect % width;
    }

    /**
     * Get the array of the squares on which we can move if we do a Up/Down or Left/Right movement.
     *
     * @param currentSquare
     * @param possibleSquaresColor
     * @return
     */
    public Set<Square> getLineSquares(Square currentSquare, Set<Color> possibleSquaresColor) {
        Set<Square> crossSquares = new HashSet<>();

        crossSquares.add(getUpSquare(currentSquare, possibleSquaresColor));
        crossSquares.add(getDownSquare(currentSquare, possibleSquaresColor));
        crossSquares.add(getLeftSquare(currentSquare, possibleSquaresColor));
        crossSquares.add(getRightSquare(currentSquare, possibleSquaresColor));

        return crossSquares;
    }

    public Square getUpSquare(Square square, Set<Color> possibleSquaresColor) {
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
     * Check that x and y are in the board and that the color is correct.
     *
     * @param x
     * @param y
     * @param possibleSquaresColor
     * @return boolean
     */
    private boolean canMoveTo(int x, int y, Set<Color> possibleSquaresColor) {
        return isInBoard(x, y) && gameBoard[y][x].canMoveTo(possibleSquaresColor);
    }

    /**
     * <b>Check that a set of coordinates.</b>
     *
     * @param x
     * @param y
     * @return true if x and y are two possible index in the board, false otherwise.
     */
    private boolean isInBoard(int x, int y) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    public Square getDownSquare(Square square, Set<Color> possibleSquaresColor) {
        return returnSquareIfCanMoveToNullOtherwise(square.getX(), square.getY() - 1, possibleSquaresColor);
    }

    /**
     * If the square is on the left edge and in an arm, we cannot move to the square at its left
     * (x-1). If we are not in an arm, we must correct the x coordinate.
     *
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
     * <b>Get the left square if the move is valid for a wizard.</b>
     *
     * @param square The square on which to start.
     *
     * @return The left square or null.
     */
    public Square getLeftSquare(Square square) {
        Set<Color> colorSet = new HashSet<>();
        colorSet.add(Color.ALL);

        return getLeftSquare(square, colorSet);
    }

    /**
     * Returns true if square is located in an arm.
     *
     * @param square
     * @return boolean
     */
    private boolean isInArm(Square square) {
        return square.getY() > innerCircleHigherY;
    }

    /**
     * Returns true if square is on a left Edge of an arm.
     *
     * @param square
     * @return boolean
     */
    private boolean onLeftEdge(Square square) {
        return square.getX() % armsWidth == 0;
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
     * <b>Get the right square if the move is valid for a wizard.</b>
     *
     * @param square The square on which to start.
     *
     * @return The right square or null.
     */
    public Square getRightSquare(Square square) {
        Set<Color> colorSet = new HashSet<>();
        colorSet.add(Color.ALL);

        return getRightSquare(square, colorSet);
    }

    /**
     * Returns true if square is on the right edge of an arm.
     *
     * @param square
     * @return boolean
     */
    private boolean onRightEdge(Square square) {
        return square.getX() % armsWidth == armsWidth - 1;
    }

    /**
     * Returns the array of 4 squares on which we can move if we do diagonals movements.
     *
     * @param currentSquare
     * @param possibleSquaresColor
     * @return Square[]
     */
    public Set<Square> getDiagonalSquares(Square currentSquare, Set<Color> possibleSquaresColor) {
        Set<Square> crossSquares = new HashSet<>();

        crossSquares.add(getUpLeftSquare(currentSquare, possibleSquaresColor));
        crossSquares.add(getUpRightSquare(currentSquare, possibleSquaresColor));
        crossSquares.add(getDownLeftSquare(currentSquare, possibleSquaresColor));
        crossSquares.add(getDownRightSquare(currentSquare, possibleSquaresColor));

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
     *
     * @param square
     * @return boolean
     */
    private boolean onArmEdge(Square square) {
        return square.getY() == innerCircleHigherY + 1;
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
     *
     * @param square
     * @return
     */
    private boolean onCircleEdge(Square square) {
        return square.getY() == innerCircleHigherY;
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
        return Arrays.deepToString(gameBoard);
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }
}
