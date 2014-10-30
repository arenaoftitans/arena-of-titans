package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import java.util.Set;
import java.util.Objects;

/**
 * <b>Represents one of the squares on the board.</b>
 *
 * <div>
 * This class describes a square with the following information :
 *  <ul>
 *   <li>its coordinates on the board matrix,</li>
 *   <li>if it is occupied or not,</li>
 *   <li>its color.</li>
 *  </ul>
 * </div>
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public class Square {
    /**
     * Used to know if there is a player on this square.
     *
     * @see Square#empty()
     * @see Square#isOccupied()
     * @see Square#setAsOccupied()
     *
     * @since 1.0
     */
    private boolean occupied;
    /**
     * The x coordinate of this square in the board matrix it belongs to.<br/>
     * Once initialized, it cannot be changed.
     *
     * @see Square#getX()
     *
     * @since 1.0
     */
    private final int x;
    /**
     * The y coordinate of this square in the board matrix it belongs to.<br/>
     * Once initialized, it cannot be changed.
     *
     * @see Square#getY()
     *
     * @since 1.0
     */
    private final int y;
    /**
     * The color of this square.<br/>
     * Once initialized, it cannot be changed.
     *
     * @see Color
     *
     * @see Square#getColor()
     *
     * @since 1.0
     */
    private final Color color;

    /**
     * <b>Constructor initializing the square with the given parameters.</b>
     * <div>
     *  The occupied state is false by default.
     * </div>
     *
     * @param x
     *          The x coordinate of this square in the board matrix.
     * @param y
     *          The y coordinate of this square in the board matrix.
     * @param color
     *          The color of this square.
     *
     * @see Color
     *
     * @see Square#color
     * @see Square#occupied
     * @see Square#x
     * @see Square#y
     *
     * @since 1.0
     */
    public Square(int x, int y, Color color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.occupied = false;
    }

    /**
     * <b>Getter for the x coordinate.</b>
     *
     * @return
     *          The x coordinate.
     *
     * @see Square#x
     *
     * @since 1.0
     */
    public int getX() {
        return x;
    }

    /**
     * <b>Getter for the y coordinate.</b>
     *
     * @return
     *          The y coordinate.
     *
     * @see Square#y
     *
     * @since 1.0
     */
    public int getY() {
        return y;
    }

    /**
     * <b>Getter for the color of the square.</b>
     *
     * @return
     *          The color of the square.
     *
     * @see Square#color
     *
     * @since 1.0
     */
    public Color getColor() {
        return color;
    }

    /**
     * <b>This method returns the occupied state of the square.</b>
     *
     * @return
     *          The occupied state of the square.
     *
     * @see Square#occupied
     *
     * @since 1.0
     */
    public boolean isOccupied() {
        return occupied;
    }

    /**
     * <b>Changes the occupied state of the square to true.</b>
     *
     * @see Square#occupied
     *
     * @since 1.0
     */
    public void setAsOccupied() {
        occupied = true;
    }

    /**
     * <b>Changes the occupied state of this square to false.</b>
     *
     * @see Square#occupied
     *
     * @since 1.0
     */
    public void empty() {
        occupied = false;
    }

    /**
     * <b>Determines if a card with the given set of possible colors can aim for this square.</b>
     * <div>
     *  False will be returned if the square is occupied or if its color is not contained in the given set of colors.
     * </div>
     *
     * @param possibleSquaresColor
     *          The set of colors given.
     *
     * @return
     *          True if its possible with the set of given colors to aim for this square.
     *
     * @see Card#possibleSquaresColor
     *
     * @see Square#color
     * @see Square#occupied
     *
     * @since 1.0
     */
    public boolean canMoveTo(Set<Color> possibleSquaresColor) {
        return !occupied && possibleSquaresColor.contains(color);
    }

    /**
     * <b>Return the identifier of the square.</b>
     * <div>
     *  This identifier will be x-y.
     * </div>
     *
     * @return String
     *          The identifier with a format x-y
     *
     * @see Square#x
     * @see Square#y
     *
     * @since 1.0
     */
    public String getId() {
        return String.format("%s-%s", x, y);
    }

    /**
     * <b>Returns the CSS identifier of the board.</b>
     * <div>
     *  This identifier will be #x-y.
     * </div>
     *
     * @return String
     *          The CSS identifier whit a format #x-y
     *
     * @see Square#x
     * @see Square#y
     *
     * @since 1.0
     */
    public String getCssId() {
        return String.format("#%s-%s", x, y);
    }

    /**
     * <b>Returns a customized hashcode.</b>
     * <div>
     *  The value of the customized hashcode is : ((7 * 11 + x) * 11 + y) * 11 + hash(color) where hash is the default Objects.hashCode() method.
     * </div>
     *
     * @return
     *          A customized hashcode.
     *
     * @see Square#color
     * @see Square#x
     * @see Square#y
     *
     * @since 1.0
     */
    @Override
    public int hashCode() {
        return ((11 * 7 + x) * 11 + y) * 11 + Objects.hashCode(color);
        /*int hash = 7;
        hash = 11 * hash + this.x;
        hash = 11 * hash + this.y;
        hash = 11 * hash + Objects.hashCode(this.color);
        return hash;*/
    }

    /**
     * <b>Returns true if the given object is the same square.</b>
     * <div>
     *  Returns true if the object is a non-null square with the same x,y and color than this square.<br/>
     *  Return false otherwise.
     * </div>
     *
     * @param obj
     *          The object to compare to this square.
     *
     * @return
     *          True if the given object is the same square.
     *
     * @see Square#color
     * @see Square#x
     * @see Square#y
     *
     * @since 1.0
     */
    @Override
    public boolean equals(Object obj) {
        if (obj == null || obj.getClass() != Square.class) {
            return false;
        } else {
            final Square other = (Square) obj;
            return (x == other.x && y == other.y && color == other.color);
        }
    }

    /**
     * <b>Return a human readable string for this square.</b>
     * <div>
     *  The string is : Square{occupiedState,x,y,color}
     * </div>
     *
     * @return
     *          The custom human readable string.
     *
     * @see Square#color
     * @see Square#occupied
     * @see Square#x
     * @see Square#y
     *
     * @since 1.0
     */
    @Override
    public String toString() {
        return "Square{" + "occupied=" + occupied + ", x=" + x + ", y=" + y + ", color=" + color + "}";
    }
}
