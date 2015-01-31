package com.aot.engine.cards.movements.json;

import com.aot.engine.cards.movements.json.JsonMovementsCard;
import com.aot.engine.cards.movements.json.JsonMovementsCards;
import com.aot.engine.Color;
import com.aot.engine.board.Board;
import com.aot.engine.cards.movements.DiagonalMovementsCard;
import com.aot.engine.cards.movements.KnightMovementsCard;
import com.aot.engine.cards.movements.LineAndDiagonalMovementsCard;
import com.aot.engine.cards.movements.LineMovementsCard;
import com.aot.engine.cards.movements.MovementsCard;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <b>Factory used to create the list of the cards of the game as described in the configuration
 * file.</b>
 *
 * @author "Arena of Titans" first development team
 * @version 1.0
 */
public class MovementsCardsFactory {

    private MovementsCardsFactory() {
    }

    /**
     * Generate the list of cards based on their description in the JSON file.
     *
     * @param board The game board, imperative to create the cards.
     *
     * @param jsonMovementsCards The Java version of the JSON object containing all the informations
     * to generate the cards.
     *
     * @param colorNames The names of the colors used in the game.
     *
     * @return The list of the cards that we can use in the game.
     */
    public static List<MovementsCard> getCardsFromColorNames(Board board, JsonMovementsCards jsonMovementsCards,
            List<String> colorNames) {
        List<Color> colors = colorNames.parallelStream()
                .map(str -> Color.valueOf(str))
                .collect(Collectors.toList());

        return getCards(board, jsonMovementsCards, colors);
    }

    /**
     * Generate the list of cards based on their description in the JSON file.
     *
     * @param board The game board, imperative to create the cards.
     *
     * @param jsonMovementsCards The Java version of the JSON object containing all the informations
     * to generate the cards.
     *
     * @param colors The color used in the game.
     *
     * @return The list of the cards that we can use in the game.
     */
    public static List<MovementsCard> getCards(Board board, JsonMovementsCards jsonMovementsCards,
            List<Color> colors) {
        List<MovementsCard> cards = new ArrayList<>();
        int numberCardsPerColor = jsonMovementsCards.getNumberCardsPerColor();

        for (JsonMovementsCard jsonCard : jsonMovementsCards.getCards()) {
            cards.addAll(getCards(board, jsonCard, colors, numberCardsPerColor));
        }

        return cards;
    }

    /**
     * Return the list of all the cards of a specific name passed in parameter.
     *
     * @param board The game board.
     *
     * @param jsonCard The Java object representing a card with a specific name.
     *
     * @param colors The list of colors of the game.
     *
     * @param numberCardsPerColor The number of card to create of this type.
     *
     * @return The list of all the cards of a specific name passed in parameter.
     */
    private static List<MovementsCard> getCards(Board board, JsonMovementsCard jsonCard, List<Color> colors,
            int numberCardsPerColor) {
        List<MovementsCard> cards = new ArrayList<>();
        String movementType = jsonCard.getMovementsType();
        int numberOfMovements = jsonCard.getNumberOfMovements();
        String name = jsonCard.getName();
        List<String> additionalMovementsColors = jsonCard.getAdditionalMovementsColors();
        Map<String, List<String>> complementaryColors = jsonCard.getComplementaryColors();

        for (Color color : colors) {
            List<Color> additionalColors = getAdditionalColors(additionalMovementsColors, complementaryColors, color);
            for (int i = 0; i < numberCardsPerColor; i++) {
                MovementsCard card = getMovementsCard(board, name, movementType, numberOfMovements, color, additionalColors);
                cards.add(card);
            }
        }

        return cards;
    }

    /**
     * Return the list of additional colors for a card from the complementary colors or the
     * additional movements colors.
     *
     * @param additionalMovementsColors The list of colors to add to the possible colors of the
     * card.
     *
     * @param complementaryColors The map that give the additional color based on the color of the
     * card.
     *
     * @param color The color of the card to create.
     *
     * @return The list of additional colors for a card from the complementary colors or the
     * additional movements colors.
     */
    private static List<Color> getAdditionalColors(List<String> additionalMovementsColors, Map<String, List<String>> complementaryColors, Color color) {
        List<String> additionalColorNames = new ArrayList<>();
        if (additionalMovementsColors != null) {
            additionalColorNames.addAll(additionalMovementsColors);
        }
        if (complementaryColors != null) {
            additionalColorNames.addAll(complementaryColors.get(color.toString()));
        }

        return additionalColorNames.parallelStream()
                    .map(str -> Color.valueOf(str))
                    .collect(Collectors.toList());
    }

    /**
     * Create the correct movements card based on the method parameter.
     *
     * @param board The game board.
     *
     * @param name The name of the card.
     *
     * @param movementType The type of movements of the card.
     *
     * @param numberOfMovements The number of movements of the card.
     *
     * @param color The color of the card to create.
     *
     * @param additionalColors The additional colors of the card.
     *
     * @return The created card or null if the type of movements is unknown.
     */
    private static MovementsCard getMovementsCard(Board board, String name, String movementType,
            int numberOfMovements, Color color, List<Color> additionalColors) {
        switch (movementType) {
            case "line":
                return new LineMovementsCard(board, name, numberOfMovements, color, additionalColors);
            case "diagonal":
                return new DiagonalMovementsCard(board, name, numberOfMovements, color, additionalColors);
            case "lineAndDiagonal":
                return new LineAndDiagonalMovementsCard(board, name, numberOfMovements, color, additionalColors);
            case "knight":
                return new KnightMovementsCard(board, name, numberOfMovements, color, additionalColors);
            default:
                return null;
        }
    }

}
