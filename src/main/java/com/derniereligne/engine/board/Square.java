package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import java.util.Set;
import java.util.Objects;

public class Square {
    private boolean occupied = false;
    public final int x;
    public final int y;
    public final Color color;

    public Square(int x, int y, Color color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    public boolean isOccupied() {
        return occupied;
    }

    public void setAsOccupied() {
        this.occupied = true;
    }

    public boolean canMoveTo(Set<Color> possibleSquaresColor) {
        return !isOccupied() && possibleSquaresColor.contains(this.color);
    }

    public void empty() {
        occupied = false;
    }

    public String getId() {
        return String.format("%s-%s", x, y);
    }

    public String getCssId() {
        return String.format("#%s-%s", x, y);
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 11 * hash + this.x;
        hash = 11 * hash + this.y;
        hash = 11 * hash + Objects.hashCode(this.color);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Square other = (Square) obj;
        if (this.x != other.x) {
            return false;
        }
        if (this.y != other.y) {
            return false;
        }
        if (this.color != other.color) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "Square{" + "occupied=" + occupied + ", x=" + x + ", y=" + y + ", color=" + color + '}';
    }
}
