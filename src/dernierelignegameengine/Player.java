package dernierelignegameengine;

import java.util.Set;

public class Player {
    private final String name;
    private Board board;
    private Square currentSquare;

    public Player(String name, Board board, Square currentSquare) {
        this.name = name;
        this.board = board;
        this.currentSquare = currentSquare;
        board.movePlayerTo(this, currentSquare);
    }

    public void play(Card card) {
        Set<Square> possibleMovements = card.getPossibleMovements(board, currentSquare);
        System.out.println("Size: " + possibleMovements.size());
        System.out.println(possibleMovements.toString());
    }

    public void moveTo(Square square) {
        board.movePlayerTo(this, square);
        currentSquare.empty();
        currentSquare = square;
    }
}
