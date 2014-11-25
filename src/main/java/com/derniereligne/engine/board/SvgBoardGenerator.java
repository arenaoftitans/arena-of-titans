package com.derniereligne.engine.board;

import com.derniereligne.engine.Color;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
public final class SvgBoardGenerator {

    /**
     * The XML namespace for XPath.
     */
    private static final Namespace NS = Namespace.getNamespace("ns", "http://www.w3.org/2000/svg");
    /**
     * The XML namespace the the elements we add.
     */
    private static final Namespace SVG_NS = Namespace.getNamespace("http://www.w3.org/2000/svg");
    /**
     * The common XPathFactory to create XPathExpression.
     */
    private static final XPathFactory X_PATH_FACTORY = XPathFactory.instance();
    /**
     * The folder in which we must save the SVGs.
     */
    private static final String SVG_FILENAME_PATH = "src/main/webapp/WEB-INF/svg/";
    /**
     * The name of the SVG template file.
     */
    private static final String TEMPLATE_NAME = "template.svg";
    /**
     * The name of the board (used to save it in the correct file).
     */
    private final String boardName;
    /**
     * The file in which the board is saved. This file is used as a cache to avoid regenerating the
     * board if it already exits.
     */
    private final String svgFileName;
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
    private final Map<String, String> fill;
    /**
     * The width of the element used to fill the board.
     */
    private final int filledElementWidth;
    /**
     * The height of the element used to fill the board.
     */
    private final int filledElementHeigth;
    /**
     * The tag of the element used to fill the board.
     */
    private final String filledElementTag;
    /**
     * The x coordinate of the rotation center of the board.
     */
    private final int rotationCenterX;
    /**
     * The y coordinate of rotation center of the board.
     */
    private final int rotationCenterY;
    /**
     * The lines of the element used to create the SVG (and not fill it).
     */
    private final List<List<Map<String, String>>> lines;
    /**
     * One of the attributes name.
     */
    private static final String transformString = "transform";
    /**
     * @param jsonBoard The JSON description of the board.
     *
     * @param boardName The name of the board being generated.
     */
    public SvgBoardGenerator(JsonBoard jsonBoard, String boardName) {
        JsonSvg jsonSvg = jsonBoard.getJsonSvg();
        this.boardName = boardName;
        svgFileName = SVG_FILENAME_PATH + this.boardName + ".svg";
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
            completeColorLine.add(Color.valueOf(color));
        }

        disposition.add(completeColorLine);
    }

    /**
     * Load the template file into the Document attribute.
     */
    private void loadTemplate() {
        try {
            InputStream templatePath = getClass().getResourceAsStream(TEMPLATE_NAME);
            SAXBuilder builder = new SAXBuilder();
            document = builder.build(templatePath);
            Element root = document.getRootElement();
            layer = root.getChild("g", NS);
        } catch (IOException | JDOMException ex) {
            Logger.getLogger(SvgBoardGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Generate all the board as described in the class attributes. The board is only generated if
     * it is not found in the cache.
     *
     * @return The SVG as a String.
     */
    public String generateSvgBoard() {
        File svgFile = new File(svgFileName);
        if (svgFile.exists()) {
            return toString();
        } else {
            return regenerateSvgBoard();
        }
    }

    /**
     * Force the generation of the svg file.
     *
     * @return The SVG as a String.
     */
    public String regenerateSvgBoard() {
        for (int i = 0; i < numberOfArms; i++) {
            rotateBoard();
            drawLines();
            fillSvg();
        }

        rotateBoard();
        paintSvg();
        save();

        return toString();
    }

    /**
     * Rotate the whole board of 45°.
     */
    private void rotateBoard() {
        List<Element> elementList = layer.getChildren();
        for (Element element : elementList) {
            int angle;
            if (element.getAttribute(transformString) != null) {
                String transformation = element.getAttribute(transformString).getValue();
                if (" ".equals(transformation.substring(9, 10))) {
                    angle = Integer.parseInt(transformation.substring(7, 9));
                } else {
                    angle = Integer.parseInt(transformation.substring(7, 10));
                }
                angle += 45;
            } else {
                angle = 45;
            }
            String transformationValue = "rotate(" + angle + " " + rotationCenterX + " " + rotationCenterY + ")";
            element.setAttribute(transformString, transformationValue);
        }
    }

    /**
     * Draw the non-rectangular elements of the board.
     */
    private void drawLines() {
        yid = 0;
        for (List<Map<String, String>> line : lines) {
            int xidPlus = 0;
            for (Map<String, String> element : line) {
                int currentXid = xid + xidPlus;
                Element svgElement = new Element(element.get("tag"), SVG_NS);
                svgElement.setAttribute("d", element.get("d"));
                svgElement.setAttribute("id", String.format("square-%d-%d", currentXid, yid));
                setNgClickDirective(svgElement, currentXid, yid);
                layer.addContent(svgElement);
                xidPlus++;
            }
            yid++;
        }
    }

    /**
     * Set the ng-click directive to the correct value.
     *
     * @param element The element on which to set the directive.
     *
     * @param elementXid The element x id.
     *
     * @param elementYid The element y id.
     */
    private void setNgClickDirective(Element element, int elementXid, int elementYid) {
        element.setAttribute("ng-click", String.format("play(%s, %s)", elementXid, elementYid));
    }

    /**
     * Draw the lines of rectangle of an arm.
     */
    private void fillSvg() {
        int xidPlus = 0;
        for (int i = 0; i < armsWidth; i++) {
            yid = lines.size();
            for (int j = 0; j < armsLength; j++) {
                int currentXid = xid + xidPlus;
                Element element = new Element(filledElementTag, SVG_NS);
                element.removeAttribute("xmlns");
                element.setAttribute("id", String.format("square-%d-%d", currentXid, yid));
                element.setAttribute("x", Integer.toString(i * filledElementHeigth + originX));
                element.setAttribute("y", Integer.toString(j * filledElementWidth + originY));
                element.setAttribute("height", Integer.toString(filledElementHeigth));
                element.setAttribute("width", Integer.toString(filledElementWidth));
                setNgClickDirective(element, currentXid, yid);
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
                String expression = String.format(".//*[@id=\"square-%d-%d\"]", x, y);
                XPathExpression<Element> squaresExpression = X_PATH_FACTORY.compile(expression, Filters.element(), null, NS);
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
    private void save() {
        try {
            XMLOutputter xmlOutput = new XMLOutputter(Format.getPrettyFormat());

            xmlOutput.setFormat(Format.getPrettyFormat());
            xmlOutput.output(document, new FileWriter(svgFileName));
        } catch (IOException ex) {
            Logger.getLogger(SvgBoardGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public List<List<Color>> getColorDisposition() {
        return colorDisposition;
    }

    public static Namespace getNamespace() {
        return NS;
    }

    public static Namespace getSvgNamespace() {
        return SVG_NS;
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
