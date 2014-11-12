/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
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
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

/**
 *
 * @author jenselme
 */
public class SvgBoardGeneratorTest {

    private SvgBoardGenerator svgBoardGenerator;
    private JsonSvg jsonSvg;
    private List<List<Color>> disposition;

    @Before
    public void init() {
        try {
            String jsonFileName = "target/classes/com/derniereligne/engine/boards.json";
            String jsonString = FileUtils.readFileToString(new File(jsonFileName));
            Gson gson = new Gson();
            JsonParser parser = new JsonParser();
            JsonObject jsonObject = parser.parse(jsonString).getAsJsonObject();
            JsonBoard jsonBoard = gson.fromJson(jsonObject.get("standardBoard"), JsonBoard.class);

            svgBoardGenerator = new SvgBoardGenerator(jsonBoard);

            disposition = svgBoardGenerator.getColorDisposition();
        } catch (IOException ex) {
            Logger.getLogger(SvgBoardGeneratorTest.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Test
    public void testGetSave() {

    }

    @Test
    public void testGetColorDispositionSize() {
        // 6 lines
        assertEquals(9, disposition.size());
        // 16 column
        for (List<Color> line : disposition) {
            assertEquals(32, line.size());
        }
    }

    @Test
    public void testGetColorDisposition() {
        assertEquals(Color.BLUE, disposition.get(5).get(0));
        assertEquals(Color.BLACK, disposition.get(5).get(1));
        assertEquals(Color.BLACK, disposition.get(3).get(0));
        assertEquals(Color.RED, disposition.get(3).get(3));
        assertEquals(Color.YELLOW, disposition.get(2).get(15));
        assertEquals(Color.YELLOW, disposition.get(0).get(15));
        assertEquals(Color.YELLOW, disposition.get(0).get(31));
        assertEquals(Color.BLACK, disposition.get(8).get(31));
    }

}
