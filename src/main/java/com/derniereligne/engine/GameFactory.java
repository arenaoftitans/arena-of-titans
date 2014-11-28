package com.derniereligne.engine;

import com.derniereligne.engine.board.SvgBoardGenerator;
import com.derniereligne.engine.board.JsonBoard;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.Deck;
import com.derniereligne.engine.cards.movements.MovementsCard;
import com.derniereligne.engine.cards.movements.MovementsCardsFactory;
import com.derniereligne.http.rest.JsonPlayer;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.apache.commons.io.FileUtils;

/**
 * <b>Create all element needed for a game (Board and Deck).</b>
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public class GameFactory {

    /**
     * The name of the JSON file.
     */
    private static final String JSON_FILENAME = "games.json";
    /**
     * The name of the board.
     */
    protected final String boardName;
    /**
     * The Java representation of a game.
     */
    protected final JsonGame jsonGame;
    /**
     * The Java representation of the jsonBoard.
     */
    protected final JsonBoard jsonBoard;
    /**
     * The width of the board.
     */
    private final int width;
    /**
     * The height of the board.
     */
    private final int height;
    /**
     * The higher y coordinate of the circle.
     */
    private final int innerCircleHigherY;
    /**
     * The width of the arms.
     */
    private final int armsWidth;
    /**
     * The object used to generate the SVG.
     */
    private SvgBoardGenerator svgBoardGenerator;
    /**
     * The generate game board.
     */
    private Board gameBoard;
    /**
     * The current match.
     */
    private Match match;
    /**
     * The functional interface used to create decks.
     */
    private DeckCreator deckCreator;

    public GameFactory() {
        this("standard");
    }

    public GameFactory(String boardName) {
        this.boardName = boardName;
        try {
            URI resource = getClass().getResource(JSON_FILENAME).toURI();
            String jsonString = FileUtils.readFileToString(new File(resource));

            Gson gson = new Gson();
            JsonParser parser = new JsonParser();
            JsonObject jsonObject = parser.parse(jsonString).getAsJsonObject();
            jsonGame = gson.fromJson(jsonObject.get(boardName), JsonGame.class);
            jsonBoard = jsonGame.getBoard();

            // Initialize the board.
            width = jsonBoard.getWidth();
            height = jsonBoard.getHeight();
            innerCircleHigherY = jsonBoard.getInnerCircleHigherY();
            armsWidth = jsonBoard.getArmsWidth();
            svgBoardGenerator = new SvgBoardGenerator(jsonBoard, boardName);
            createBoard();
            deckCreator = () -> {
                List<MovementsCard> cards = MovementsCardsFactory.getCardsFromColorNames(gameBoard,
                        jsonGame.getMovementsCards(), jsonGame.getColors());
                Deck deck = new Deck(cards);

                return deck;
            };
        } catch (IOException | URISyntaxException ex) {
            Logger.getLogger(Board.class.getName()).log(Level.SEVERE, null, ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    /**
     * Return the matrix representing the board in Java for the game engine.
     *
     * @param boardName
     * @return
     */
    private void createBoard() {
        Square[][] board = new Square[height][width];
        List<List<Color>> disposition = svgBoardGenerator.getColorDisposition();

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                Color color = disposition.get(i).get(j);
                board[i][j] = new Square(j, i, color);
            }
        }

        gameBoard = new Board(width, height, innerCircleHigherY, armsWidth, board);
    }

    /**
     * <b>Returns the name of the board.</b>
     *
     * @return The name of the board.
     *
     * @see GameFactory#boardName
     *
     * @since 1.0
     */
    public String getBoardName() {
        return boardName;
    }

    /**
     * <b>Returns the string associated to the SvgBoardGenerator.</b>
     *
     * @return The string associated to the SvgBoardGenerator.
     *
     * @see GameFactory#svgBoardGenerator
     *
     * @see SvgBoardGenerator#toString()
     *
     * @since 1.0
     */
    public String getSvg() {
        return svgBoardGenerator.toString();
    }

    /**
     * <b>Returns a match with the players given in parameter.</b>
     * <div>
     * If the current match is null, creates a new match with the board and the players.
     * </div>
     *
     * @param jsonPlayers Players for the new match.
     *
     * @return The current match.
     *
     * @see GameFactory#getBoard()
     * @see GameFactory#getPlayers(java.util.List)
     *
     * @see JsonPlayer
     * @see Match
     * @see Match#Match(java.util.List, com.derniereligne.engine.board.Board)
     *
     * @since 1.0
     */
    public Match createNewMatch(List<JsonPlayer> jsonPlayers) {
        List<Player> players = getPlayers(jsonPlayers);
        match = new Match(players, gameBoard, deckCreator);

        return match;
    }

    /**
     * <b>Returns a list of players from a list of jsonPlayers.</b>
     *
     * @param jsonPlayers List to convert into players.
     *
     * @return List converted in players.
     *
     * @see JsonPlayer
     * @see JsonPlayer#getName()
     * @see JsonPlayer#getIndex()
     * @see Player#Player(java.lang.String, int)
     *
     * @since 1.0
     */
    private List<Player> getPlayers(List<JsonPlayer> jsonPlayers) {
        return jsonPlayers.parallelStream()
                .map(jsplayer -> new Player(jsplayer.getName(), jsplayer.getIndex()))
                .collect(Collectors.toList());
    }

    public Match getMatch() {
        return match;
    }

    public DeckCreator getDeckCreator() {
        return deckCreator;
    }

    public Board getBoard() {
        return gameBoard;
    }

}
