package com.derniereligne.engine.cards.movements;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.JsonGame;
import com.derniereligne.engine.board.SvgBoardGeneratorTest;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

public class MovementsCardsFactoryTest {

    private List<MovementsCard> cards;

    @Before
    public void init() {
        try {
            String jsonFileName = "target/classes/com/derniereligne/engine/games.json";
            String jsonString = FileUtils.readFileToString(new File(jsonFileName));
            Gson gson = new Gson();
            JsonParser parser = new JsonParser();
            JsonObject jsonObject = parser.parse(jsonString).getAsJsonObject();
            JsonGame jsonGame = gson.fromJson(jsonObject.get("standard"), JsonGame.class);
            JsonMovementsCards jsonMovementsCards = jsonGame.getMovementsCards();
            List<String> colorNames = jsonGame.getColors();
            List<Color> colors = new ArrayList<>();

            for (String colorName : colorNames) {
                colors.add(Color.valueOf(colorName));
            }

            cards = new MovementsCardsFactory().getCards(null, jsonMovementsCards, colors);
        } catch (IOException ex) {
            Logger.getLogger(SvgBoardGeneratorTest.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Test
    public void testGetCardsNumberOfCards() {
        int cardTypeNumber = 7;
        int colorNumber = 4;
        int numberCardsPerColor = 1;
        assertEquals(cardTypeNumber * colorNumber * numberCardsPerColor, cards.size());
    }

    @Test
    public void testGetCardsNumberOfQueen() {
        List<MovementsCard> queens = new ArrayList<>();
        for (MovementsCard card : cards) {
            if (card.getName().equals("Queen")) {
                assertTrue(card instanceof LineAndDiagonalMovementsCard);
                queens.add(card);
            }
        }

        assertEquals(4, queens.size());
    }

    @Test
    public void testGetCardsNumberOfBishop() {
        List<MovementsCard> queens = new ArrayList<>();
        for (MovementsCard card : cards) {
            if (card.getName().equals("Bishop")) {
                assertTrue(card instanceof DiagonalMovementsCard);
                queens.add(card);
            }
        }

        assertEquals(4, queens.size());
    }

    @Test
    public void testGetCardsNumberOfKing() {
        List<MovementsCard> queens = new ArrayList<>();
        for (MovementsCard card : cards) {
            if (card.getName().equals("King")) {
                assertTrue(card instanceof LineMovementsCard);
                queens.add(card);
            }
        }

        assertEquals(4, queens.size());
    }

}
