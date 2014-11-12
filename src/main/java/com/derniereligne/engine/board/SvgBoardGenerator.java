package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import java.io.ByteArrayOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.Namespace;
import org.jdom2.filter.Filters;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPathExpression;
import org.jdom2.xpath.XPathFactory;

/**
 * This class generate the SVG based on a description saved in a config file.
 *
 * @author jenselme
 */
public class SvgBoardGenerator {

    /**
     * The XML namespace for XPath.
     */
    private static final Namespace ns = Namespace.getNamespace("ns", "http://www.w3.org/2000/svg");
    /**
     * The XML namespace the the elements we add.
     */
    private static final Namespace svgNs = Namespace.getNamespace("http://www.w3.org/2000/svg");
    /**
     * The common XPathFactory to create XPathExpression.
     */
    private static final XPathFactory xPathFactory = XPathFactory.instance();
    /**
     * The folder in which we must save the SVGs.
     */
    private static final String svgFilePath = "src/main/webapp/WEB-INF/svg/";

    /**
     * The name of the SVG template file.
     */
    private final static String templateName = "template.svg";
    /**
     * The name of the SVG layer that will contain the board.
     */
    private final static String boardLayerId = "boardLayer";
    /**
     * The name of the board (used to save it in the correct file).
     */
    private final String boardName;
    /**
     * The SVG document object.
     */
    private Document document;
    /**
     * The node object representing the layer that will contain the board.
     */
    private Element layer;
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
    public SvgBoardGenerator(JsonBoard jsonBoard, String boardName) {
        JsonSvg jsonSvg = jsonBoard.getJsonSvg();
        this.boardName = boardName;
        xid = 0;
        yid = 0;
        numberOfArms = jsonBoard.getNumberArms();
        colorDisposition = generateColorDisposition(jsonBoard.getCircleColors(),
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
        generateSvgBoard();
    }

    /**
     * Returns the matrix representing the color of the board.
     *
     * @param boardName
     * @return
     */
    private List<List<Color>> generateColorDisposition(String[] circleColors, String[] armColors, int numberArms) {
        List<List<Color>> disposition = new ArrayList<>();

        for (String partialLine : circleColors) {
            appendLineDisposition(disposition, partialLine, numberArms / 2 - 1);
        }

        for (String partialLine : armColors) {
            appendLineDisposition(disposition, partialLine, numberArms - 1);
        }

        return disposition;
    }

    private void appendLineDisposition(List<List<Color>> disposition, String partialLine,
            int numberTimeToRepeatPartialLine) {
        String compleLineString = partialLine;
        for (int i = 0; i < numberTimeToRepeatPartialLine; i++) {
            compleLineString = compleLineString + "," + partialLine;
        }

        String[] completeLine = compleLineString.split(",");
        List<Color> completeColorLine = new ArrayList<>();
        for (String color : completeLine) {
            completeColorLine.add(getColor(color));
        }

        disposition.add(completeColorLine);
    }

    private Color getColor(String colorName) {
        switch (colorName) {
            case "BLACK":
                return Color.BLACK;
            case "BLUE":
                return Color.BLUE;
            case "RED":
                return Color.RED;
            case "YELLOW":
                return Color.YELLOW;
            default:
                return Color.ALL;
        }
    }

    /**
     * Load the template file into the Document attribute.
     */
    private void loadTemplate() {
        try {
            InputStream templatePath = getClass().getResourceAsStream(templateName);
            SAXBuilder builder = new SAXBuilder();
            document = builder.build(templatePath);
            Element root = document.getRootElement();
            layer = root.getChild("g", ns);
        } catch (IOException | JDOMException ex) {
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
        paintSvg();
    }

    /**
     * Rotate the whole board of 45°.
     */
    private void rotateBoard() {
        List<Element> elementList = layer.getChildren();
        for (Element element : elementList) {
            int angle;
            if (element.getAttribute("transform") != null) {
                String transformation = element.getAttribute("transform").getValue();
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
            element.setAttribute("transform", transformationValue);
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
                Element svgElement = new Element(element.get("tag"), svgNs);
                svgElement.setAttribute("d", element.get("d"));
                svgElement.setAttribute("id", String.format("%d-%d", xid + xidPlus, yid));
                layer.addContent(svgElement);
                xidPlus++;
            }
            yid++;
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
                Element element = new Element(filledElementTag, svgNs);
                element.removeAttribute("xmlns");
                element.setAttribute("id", String.format("%d-%d", xid + xidPlus, yid));
                element.setAttribute("x", Integer.toString(i * filledElementHeigth + originX));
                element.setAttribute("y", Integer.toString(j * filledElementWidth + originY));
                element.setAttribute("height", Integer.toString(filledElementHeigth));
                element.setAttribute("width", Integer.toString(filledElementWidth));
                yid++;
                layer.addContent(element);
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
    private void paintSvg() {
        for (int y = 0; y < colorDisposition.size(); y++) {
            List<Color> line = colorDisposition.get(y);
            for (int x = 0; x < line.size(); x++) {
                String expression = String.format(".//*[@id=\"%d-%d\"]", x, y);
                XPathExpression<Element> squaresExpression = xPathFactory.compile(expression, Filters.element(), null, ns);
                List<Element> squares = squaresExpression.evaluate(document);
                Element square = squares.get(0);
                Color color = colorDisposition.get(y).get(x);
                String svgColor = color.toString().toLowerCase();
                square.setAttribute("class", svgColor + "-square");
            }
        }
    }

    /**
     * Save the generated SVG.
     */
    public void save() {
        try {
            XMLOutputter xmlOutput = new XMLOutputter(Format.getPrettyFormat());

            xmlOutput.setFormat(Format.getPrettyFormat());
            xmlOutput.output(document, new FileWriter(svgFilePath + boardName + ".svg"));
        } catch (IOException ex) {
            Logger.getLogger(SvgBoardGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public List<List<Color>> getColorDisposition() {
        return colorDisposition;
    }

    public static Namespace getNamespace() {
        return ns;
    }

    public static Namespace getSvgNamespace() {
        return svgNs;
    }

    @Override
    public String toString() {
        XMLOutputter xmlOutput = new XMLOutputter(Format.getPrettyFormat());
        OutputStream os = new ByteArrayOutputStream();
        try {
            xmlOutput.setFormat(Format.getPrettyFormat());
            xmlOutput.output(document, os);
        } catch (IOException ex) {
            Logger.getLogger(SvgBoardGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }

        return os.toString();
    }

}
