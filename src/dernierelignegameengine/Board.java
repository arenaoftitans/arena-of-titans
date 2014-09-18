package dernierelignegameengine;

public class Board {
    private final static int WIDTH = 10;
    private final static int HEIGHT = 3;
    private Square[][] board = new Square[HEIGHT][WIDTH];
    private static final Color[][] disposition =
    {
        {Color.WHITE, Color.BLACK, Color.WHITE, Color.BLACK, Color.BLACK, Color.WHITE, Color.BLACK, Color.WHITE, Color.WHITE, Color.WHITE},
        {Color.WHITE, Color.WHITE, Color.VOID, Color.VOID, Color.VOID, Color.BLACK, Color.WHITE, Color.VOID, Color.VOID, Color.VOID},
        {Color.WHITE, Color.BLACK, Color.VOID, Color.VOID, Color.VOID, Color.BLACK, Color.WHITE, Color.VOID, Color.VOID, Color.VOID},
    };

    public Board() {
        for (int i=0; i < 3; i++) {
            for (int j=0; j < 10; j++) {
                board[i][j] = new Square(j, i, disposition[i][j]);
            }
        }
    }

    public boolean canMoveTo(Square square, Color cardColor) {
        int x = square.x;
        int y = square.y;

        if ( x < WIDTH && y >= 0 && y < HEIGHT && board[y][x].canMoveTo(cardColor)) {
            return true;
        } else {
            return false;
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
}
