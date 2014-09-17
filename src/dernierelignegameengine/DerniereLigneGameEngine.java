package dernierelignegameengine;

public class DerniereLigneGameEngine {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        Board board = new Board();
        Square square = board.getSquare(0, 0);
        Player player = new Player("Julien", board, square);

        Card warriorCard = new WarriorCard(Color.WHITE);
        player.play(warriorCard);

        Card bishopCard = new BishopCard(Color.WHITE);
        player.play(bishopCard);
    }
}
