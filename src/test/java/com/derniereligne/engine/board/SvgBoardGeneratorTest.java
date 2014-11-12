/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.JsonGame;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
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
    private int height;
    private int width;

    @Before
    public void init() {
        try {
            String jsonFileName = "target/classes/com/derniereligne/engine/games.json";
            String jsonString = FileUtils.readFileToString(new File(jsonFileName));
            Gson gson = new Gson();
            JsonParser parser = new JsonParser();
            JsonObject jsonObject = parser.parse(jsonString).getAsJsonObject();
            JsonGame jsonGame = gson.fromJson(jsonObject.get("standard"), JsonGame.class);
            JsonBoard jsonBoard = jsonGame.getBoard();
            height = jsonBoard.getHeight();
            width = jsonBoard.getWidth();

            svgBoardGenerator = new SvgBoardGenerator(jsonBoard, "standardBoard");

            disposition = svgBoardGenerator.getColorDisposition();
        } catch (IOException ex) {
            Logger.getLogger(SvgBoardGeneratorTest.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Test
    public void testToString() {
        try {
            String svgString = svgBoardGenerator.regenerateSvgBoard();
            InputStream svg = new ByteArrayInputStream(svgString.getBytes(StandardCharsets.UTF_8));
            SAXBuilder builder = new SAXBuilder();
            Document document = builder.build(svg);
            Element root = document.getRootElement();
            Element layer = root.getChild("g", SvgBoardGenerator.getNamespace());
            assertEquals(height * width, layer.getChildren().size());
        } catch (JDOMException | IOException ex) {
            Logger.getLogger(SvgBoardGeneratorTest.class.getName()).log(Level.SEVERE, null, ex);
        }
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
