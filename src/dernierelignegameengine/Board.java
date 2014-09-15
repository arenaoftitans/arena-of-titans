package dernierelignegameengine;

public class Board {
    private final static int WIDTH = 10;
    private final static int HEIGHT = 3;
    private Square[][] board = new Square[HEIGHT][WIDTH];
    private static final Color[][] disposition =
    {
        {Color.WHITE, Color.BLACK, Color.WHITE, Color.BLACK, Color.BLACK, Color.WHITE, Color.BLACK, Color.WHITE, Color.WHITE, Color.BLACK},
        {Color.WHITE, Color.BLACK, Color.VOID, Color.VOID, Color.VOID, Color.BLACK, Color.WHITE, Color.VOID, Color.VOID, Color.VOID},
        {Color.WHITE, Color.BLACK, Color.VOID, Color.VOID, Color.VOID, Color.BLACK, Color.WHITE, Color.VOID, Color.VOID, Color.VOID},
    };

    public Board() {
        for (int i=0; i < 3; i++) {
            for (int j=0; j < 10; j++) {
                board[i][j] = new Square(i, j, disposition[i][j]);
            }
        }
    }

    public boolean canMoveTo(Square square) {
        int x = square.x;
        int y = square.y;
        Color color = square.color;

        if (x < HEIGHT && y < WIDTH && board[x][y].canMoveTo(color)) {
            return true;
        } else {
            return false;
        }
    }

    public void movePlayerTo(Player player, Square square) {
        int x = square.x;
        int y = square.y;

        Square squareToMoveTo = board[x][y];
        squareToMoveTo.movePlayerTo(player);
    }

    public Square getSquare(int x, int y) {
        return board[x][y];
    }
}
