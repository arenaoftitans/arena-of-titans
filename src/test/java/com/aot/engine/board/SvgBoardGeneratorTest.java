package com.aot.engine.board;

import com.aot.engine.board.json.JsonBoard;
import com.aot.engine.Color;
import com.aot.engine.JsonGame;
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
import java.util.stream.Collectors;
import org.apache.commons.io.FileUtils;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

public class SvgBoardGeneratorTest {

    private SvgBoardGenerator svgBoardGenerator;
    private List<List<Color>> disposition;
    private int height;
    private int width;
    private Element boardLayer;
    private Element pawnLayer;

    @Before
    public void init() {
        try {
            String jsonFileName = "target/classes/com/aot/engine/games.json";
            String jsonString = FileUtils.readFileToString(new File(jsonFileName));
            Gson gson = new Gson();
            JsonParser parser = new JsonParser();
            JsonObject jsonObject = parser.parse(jsonString).getAsJsonObject();
            JsonGame jsonGame = gson.fromJson(jsonObject.get("standard"), JsonGame.class);
            JsonBoard jsonBoard = jsonGame.getBoard();
            height = jsonBoard.getHeight();
            width = jsonBoard.getWidth();

            svgBoardGenerator = new SvgBoardGenerator(jsonBoard, "standard");

            disposition = svgBoardGenerator.getColorDisposition();

            List<Element> layers = getLayer();
            pawnLayer = layers.get(1);
            boardLayer = layers.get(0);
        } catch (IOException ex) {
            Logger.getLogger(SvgBoardGeneratorTest.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public List<Element> getLayer() {
        try {
            String svgString = svgBoardGenerator.toString();
            InputStream svg = new ByteArrayInputStream(svgString.getBytes(StandardCharsets.UTF_8));
            SAXBuilder builder = new SAXBuilder();
            Document document = builder.build(svg);
            Element root = document.getRootElement();
            return root.getChildren("g", SvgBoardGenerator.getNamespace());
        } catch (JDOMException | IOException ex) {
            Logger.getLogger(SvgBoardGeneratorTest.class.getName()).log(Level.SEVERE, null, ex);
            assertTrue(false);
        }

        return null;
    }

    @Test
    public void testToString() {
        assertEquals(height * width, boardLayer.getChildren().parallelStream()
                .filter(elt -> !"circle".equals(elt.getName()))
                .collect(Collectors.toList())
                .size());
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

    @Test
    public void testPawns() {
        List<Element> pawns = pawnLayer.getChildren("g", SvgBoardGenerator.getNamespace());
        assertEquals(8, pawns.size());
    }

}
