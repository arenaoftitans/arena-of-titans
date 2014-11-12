/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.engine;

import java.util.List;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;
import sun.awt.X11.XConstants;

/**
 *
 * @author jenselme
 */
public class JsonSvgTest {

    private JsonSvg jsonSvg;
    private List<List<Color>> disposition;

    @Before
    public void init() {
        jsonSvg = new JsonSvg();
        String[] armColors = {"RED,YELLOW,BLACK,RED", "BLUE,RED,BLACK,YELLOW",
            "RED,YELLOW,BLACK,RED", "BLUE,RED,BLACK,YELLOW"};
        String[] circleColors = {"BLACK,YELLOW,BLACK,RED,BLUE,RED,BLACK,YELLOW", "BLACK,YELLOW,BLACK,RED,BLUE,RED,BLACK,YELLOW"};
        int numberArms = 4;
        disposition = jsonSvg
                .getColorDisposition(circleColors, armColors, numberArms);
    }

    /**
     * Check that the size of each list in disposition is correct.
     */
    @Test
    public void testGetColorDispositionSize() {
        // 6 lines
        assertEquals(6, disposition.size());
        // 16 column
        for (List<Color> line : disposition) {
            System.out.println(line);
            assertEquals(16, line.size());
        }
    }

    @Test
    public void testGetColorDisposition() {
        assertEquals(Color.BLUE, disposition.get(5).get(0));
        assertEquals(Color.RED, disposition.get(5).get(1));
        assertEquals(Color.BLUE, disposition.get(3).get(0));
        assertEquals(Color.YELLOW, disposition.get(3).get(3));
        assertEquals(Color.RED, disposition.get(2).get(15));
        assertEquals(Color.YELLOW, disposition.get(0).get(15));
    }

}
