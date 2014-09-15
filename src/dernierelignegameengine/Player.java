package dernierelignegameengine;

import java.util.ArrayList;

public class Player {
    private final String name;
    private Board board;
    private Square currentSquare;

    public Player(String name, Board board, Square currentSquare) {
        this.name = name;
        this.board = board;
        this.currentSquare = currentSquare;
    }

    public void play(Card card) {
        ArrayList<Square> possibleMovements = card.getPossibleMovements(board, currentSquare);
        if (possibleMovements.size() > 0) {
            moveTo(possibleMovements.get(0));
        }
    }

    public void moveTo(Square square) {
        board.movePlayerTo(this, square);
        currentSquare.empty();
        currentSquare = square;
    }
}
