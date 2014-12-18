/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.trumps;

import com.derniereligne.engine.trumps.Trump;
import com.derniereligne.engine.trumps.ModifyNumberOfMovesInATurnTrump;
import com.derniereligne.engine.trumps.RemovingColorTrump;
import com.derniereligne.engine.trumps.json.TrumpFactory;
import com.derniereligne.engine.trumps.json.JsonTrump;
import com.derniereligne.engine.JsonGame;
import com.derniereligne.engine.board.SvgBoardGeneratorTest;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

/**
 *
 * @author jenselme
 */
public class TrumpFactoryTest {

    private List<Trump> trumps;

    @Before
    public void init() {
        try {
            String jsonFileName = "target/classes/com/derniereligne/engine/games.json";
            String jsonString = FileUtils.readFileToString(new File(jsonFileName));
            Gson gson = new Gson();
            JsonParser parser = new JsonParser();
            JsonObject jsonObject = parser.parse(jsonString).getAsJsonObject();
            JsonGame jsonGame = gson.fromJson(jsonObject.get("standard"), JsonGame.class);
            List<JsonTrump> jsonTrumps = jsonGame.getTrumps();

            trumps = TrumpFactory.getTrumps(jsonTrumps);
        } catch (IOException ex) {
            Logger.getLogger(SvgBoardGeneratorTest.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Test
    public void testNumberOfTrumps() {
        assertEquals(5, trumps.size());
    }

    @Test
    public void testModifyNumberOfMovesInATurnTrump() {
        List<Trump> modifyNumberOfMovesInATurnTrumps = getAllTrumpsOfType(ModifyNumberOfMovesInATurnTrump.class);
        assertEquals(1, modifyNumberOfMovesInATurnTrumps.size());
    }

    private List<Trump> getAllTrumpsOfType(Class type) {
        return trumps.parallelStream()
                .filter(trump -> trump.getClass() == type)
                .collect(Collectors.toList());
    }

    @Test
    public void testRemovingColorTrump() {
        List<Trump> removingColorTrump = getAllTrumpsOfType(RemovingColorTrump.class);
        assertEquals(4, removingColorTrump.size());
    }

}
