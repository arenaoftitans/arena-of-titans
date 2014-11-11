package com.derniereligne.engine;

import com.sun.org.apache.xml.internal.security.utils.DOMNamespaceContext;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * This class generate the SVG based on a description saved in a config file.
 *
 * @author jenselme
 */
public class SvgBoardGenerator {

    private static final XPath xPath = XPathFactory.newInstance().newXPath();

    /**
     * The name of the SVG template file.
     */
    private final static String templateName = "template.svg";
    /**
     * The name of the SVG layer that will contain the board.
     */
    private final static String boardLayerId = "boardLayer";
    /**
     * The SVG document object.
     */
    private Document document;
    /**
     * The node object representing the layer that will contain the board.
     */
    private Node layer;
    /**
     * The x coordinates of a square.
     */
    private int xid;
    /**
     * The y coordinates of a square.
     */
    private int yid;
    /**
     * How the color are disposed on the board.
     */
    private final List<List<Color>> colorDisposition;
    /**
     * The number of arms that the game has.
     */
    private final int numberOfArms;
    /**
     * The width of the arms.
     */
    private final int armsWidth;
    /**
     * The length of the arms.
     */
    private final int armsLength;
    /**
     * The x coordinate from which we start filling the board.
     */
    private final int originX;
    /**
     * The y coordinate from which we start filling the board.
     */
    private final int originY;
    /**
     * The description of the element used to fill the board.
     */
    private final HashMap<String, String> fill;
    /**
     * The width of the element used to fill the board.
     */
    private final int filledElementWidth;
    /**
     * The height of the element used to fill the board.
     */
    private final int filledElementHeigth;
    /**
     * The x coordinate of the rotation center of the board.
     */
    private final String filledElementTag;
    private final int rotationCenterX;
    /**
     * The y coordinate of rotation center of the board.
     */
    private final int rotationCenterY;
    /**
     * The lines of the element used to create the SVG (and not fill it).
     */
    private final List<List<HashMap<String, String>>> lines;

    /**
     *
     * @param jsonBoard The JSON description of the board.
     *
     * @param jsonSvg The JSON description of the SVG.
     */
    public SvgBoardGenerator(JsonBoard jsonBoard, JsonSvg jsonSvg) {
        xid = 0;
        yid = 0;
        numberOfArms = jsonBoard.getNumberArms();
        colorDisposition = jsonSvg.getColorDisposition(jsonBoard.getCircleColors(),
                jsonBoard.getArmColors(), numberOfArms);
        armsWidth = jsonBoard.getArmsWidth();
        armsLength = jsonBoard.getArmsLength();
        String[] fillOrigin = jsonSvg.getFillOrigin().split(",");
        originX = Integer.parseInt(fillOrigin[0]);
        originY = Integer.parseInt(fillOrigin[1]);
        String[] rotationCenter = jsonSvg.getRotationCenter().split(",");
        rotationCenterX = Integer.parseInt(rotationCenter[0]);
        rotationCenterY = Integer.parseInt(rotationCenter[1]);
        lines = jsonSvg.getLines();
        fill = jsonSvg.getFill();
        filledElementWidth = Integer.parseInt(fill.get("width"));
        filledElementHeigth = Integer.parseInt(fill.get("height"));
        filledElementTag = fill.get("tag");
        loadTemplate();
        //layer = document.getElementById(boardLayerId);
        generateSvgBoard();
    }

    /**
     * Load the template file into the Document attribute.
     */
    private void loadTemplate() {
        try {
            InputStream templatePath = getClass().getResourceAsStream(templateName);
            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            document = docBuilder.parse(templatePath);
            NodeList nl = (NodeList) xPath.evaluate("//*[@id=\"" + boardLayerId + "\"]",
                    document.getDocumentElement(), XPathConstants.NODESET);
            layer = nl.item(0);
        } catch (ParserConfigurationException | SAXException | IOException
                | XPathExpressionException ex) {
            Logger.getLogger(SvgBoardGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Generate all the board as described in the class attributes.
     */
    private void generateSvgBoard() {
        for (int i = 0; i < numberOfArms; i++) {
            rotateBoard();
            drawLines();
            fillSvg();
        }

        rotateBoard();
        try {
            paintSvg();
        } catch (XPathExpressionException ex) {
            Logger.getLogger(SvgBoardGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Rotate the whole board of 45°.
     */
    private void rotateBoard() {
        NodeList nodeList = layer.getChildNodes();
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node element = nodeList.item(i);
            Node transformationAttribute = element.getAttributes().getNamedItem("transform");
            String transformation = transformationAttribute.getNodeValue();
            int angle;
            if (transformation.equals("")) {
                if (transformation.substring(9, 10).equals(" ")) {
                    angle = Integer.parseInt(transformation.substring(7, 9));
                } else {
                    angle = Integer.parseInt(transformation.substring(7, 10));
                }
                angle += 45;
            } else {
                angle = 45;
            }
            String transformationValue = "rotate(" + angle + " " + rotationCenterX + " " + rotationCenterY + ")";
            transformationAttribute.setTextContent(transformationValue);
        }
    }

    /**
     * Draw the non-rectangular elements of the board.
     */
    private void drawLines() {
        yid = 0;
        for (List<HashMap<String, String>> line : lines) {
            int xidPlus = 0;
            for (HashMap<String, String> element : line) {
                Node svgElement = document.createElement(element.get("tag"));
                svgElement.getAttributes().getNamedItem("d").setTextContent(element.get("d"));
                svgElement.getAttributes().getNamedItem("id")
                        .setTextContent(Integer.toString(xid + xidPlus)
                                + "-"
                                + Integer.toString(yid));
                layer.appendChild(svgElement);
            }
            yid += 1;
        }
    }

    /**
     * Draw the lines of rectangle of an arm.
     */
    private void fillSvg() {
        int xidPlus = 0;
        for (int i = 0; i < armsWidth; i++) {
            yid = lines.size();
            for (int j = 0; j < armsLength; j++) {
                Node element = document.createElement(filledElementTag);
                NamedNodeMap attributes = element.getAttributes();
                attributes.getNamedItem("id")
                        .setTextContent(Integer.toString(xid + xidPlus)
                                + "-"
                                + Integer.toString(yid));
                attributes.getNamedItem("x")
                        .setTextContent(Integer.toString(i * filledElementHeigth + originX));
                attributes.getNamedItem("y")
                        .setTextContent(Integer.toString(j * filledElementWidth + originY));
                attributes.getNamedItem("height")
                        .setTextContent(Integer.toString(filledElementHeigth));
                attributes.getNamedItem("width")
                        .setTextContent(Integer.toString(filledElementWidth));
                yid++;
                layer.appendChild(element);
            }
            xidPlus++;
        }
        xid += armsWidth;
    }

    /**
     * Add the style to the elements.
     *
     * @throws XPathExpressionException
     */
    private void paintSvg() throws XPathExpressionException {
        for (int y = 0; y < colorDisposition.size(); y++) {
            List<Color> line = colorDisposition.get(y);
            for (int x = 0; x < line.size(); x++) {
                NodeList squares = (NodeList) xPath
                        .evaluate(".//*[@id=\"" + x + "-" + y + "\"]",
                                document.getDocumentElement(), XPathConstants.NODESET);
                Node square = squares.item(0);
                Color color = colorDisposition.get(y).get(x);
                String svgColor = color.toString().toLowerCase();
                square.getAttributes()
                        .getNamedItem("class")
                        .setTextContent(svgColor + "-square");
            }
        }
    }

    @Override
    public String toString() {
        return document.toString();
    }

}
