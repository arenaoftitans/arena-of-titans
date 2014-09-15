package dernierelignegameengine;

public class Square {
    private boolean occupied = false;
    public final int x;
    public final int y;
    private Player player = null;
    public final Color color;

    public Square(int x, int y, Color color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    public boolean isOccupied() {
        return occupied;
    }

    public boolean isVoid() {
        return color == Color.VOID;
    }

    public boolean canMoveTo(Color color) {
        return !isOccupied() && !isVoid() && this.color == color;
    }

    public void movePlayerTo(Player player) {
        this.player = player;
        occupied = true;
    }

    public void empty() {
        occupied = false;
    }
}
