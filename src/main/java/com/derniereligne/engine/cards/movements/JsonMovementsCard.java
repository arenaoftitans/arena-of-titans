
package com.derniereligne.engine.cards.movements;

import java.util.List;
import java.util.Map;

public class JsonMovementsCard {

    private String name;
    private int numberOfMovements;
    private String movementsType;
    private List<String> additionalMovementsColors;
    private Map<String, List<String>> complementaryColors;

    public List<String> getAdditionalMovementsColors() {
        return additionalMovementsColors;
    }

    public Map<String, List<String>> getComplementaryColors() {
        return complementaryColors;
    }

    public String getName() {
        return name;
    }

    public int getNumberOfMovements() {
        return numberOfMovements;
    }

    public String getMovementsType() {
        return movementsType;
    }

}
