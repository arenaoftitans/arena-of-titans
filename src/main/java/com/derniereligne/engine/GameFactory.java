/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine;

import com.derniereligne.engine.board.SvgBoardGenerator;
import com.derniereligne.engine.board.JsonBoard;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.Deck;
import com.derniereligne.engine.cards.movements.MovementsCard;
import com.derniereligne.engine.cards.movements.MovementsCardsFactory;
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
    private final static String jsonFileName = "games.json";
    /**
     * The name of the board.
     */
    protected final String boardName;
    /**
     * The Java representation of a game.
     */
    protected final JsonGame jsonGame;
    /**
     * The Java representation off the jsonBoard.
     */
    protected final JsonBoard jsonBoard;
    /**
     * The width of the board.
     */
    private final int WIDTH;
    /**
     * The height of the board.
     */
    private final int HEIGHT;
    /**
     * The higher y coordinate of the circle.
     */
    private final int INNER_CIRCLE_HIGHER_Y;
    /**
     * The width of the arms.
     */
    private final int ARMS_WIDTH;
    /**
     * The board as a double array of String.
     */
    private Square[][] board;
    /**
     * The object used to generate the SVG.
     */
    private SvgBoardGenerator svgBoardGenerator;
    /**
     * The factory used to get all the cards.
     */
    private MovementsCardsFactory movementsCardsFactory;
    /**
     * The generate game board.
     */
    private Board gameBoard;
    /**
     * The generate Deck of cards.
     */
    private Deck deck;

    public GameFactory() {
        this("standard");
    }

    public GameFactory(String boardName) {
        this.boardName = boardName;
        try {
            URI resource = getClass().getResource(jsonFileName).toURI();
            String jsonString = FileUtils.readFileToString(new File(resource));

            Gson gson = new Gson();
            JsonParser parser = new JsonParser();
            JsonObject jsonObject = parser.parse(jsonString).getAsJsonObject();
            jsonGame = gson.fromJson(jsonObject.get(boardName), JsonGame.class);
            jsonBoard = jsonGame.getBoard();

            // Initialize the board.
            WIDTH = jsonBoard.getWidth();
            HEIGHT = jsonBoard.getHeight();
            INNER_CIRCLE_HIGHER_Y = jsonBoard.getInnerCircleHigherY();
            ARMS_WIDTH = jsonBoard.getArmsWidth();
            svgBoardGenerator = new SvgBoardGenerator(jsonBoard, boardName);
            createBoard();
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
        int height = HEIGHT;
        int width = WIDTH;
        board = new Square[height][width];
        List<List<Color>> disposition = svgBoardGenerator.getColorDisposition();

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                Color color = disposition.get(i).get(j);
                board[i][j] = new Square(j, i, color);
            }
        }
    }

    public Board getBoard() {
        if (gameBoard == null) {
            gameBoard = new Board(WIDTH, HEIGHT, INNER_CIRCLE_HIGHER_Y, ARMS_WIDTH, board);
        }

        return gameBoard;
    }

    public Deck getDeck() {
        if (deck == null) {
            movementsCardsFactory = new MovementsCardsFactory();
            List<MovementsCard> cards = movementsCardsFactory.getCardsFromColorNames(getBoard(),
                    jsonGame.getMovementsCards(), jsonGame.getColors());
            deck = new Deck(cards);
        }

        return deck;
    }

    public String getBoardName() {
        return boardName;
    }

    public String getSvg() {
        return svgBoardGenerator.toString();
    }

}
