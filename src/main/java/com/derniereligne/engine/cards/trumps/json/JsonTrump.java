
package com.derniereligne.engine.cards.trumps.json;

public class JsonTrump {

    private String name;
    private String description;
    private int duration;
    private int cost;
    private boolean repeatForEachColor;
    private JsonTrumpParameters parameters;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public int getDuration() {
        return duration;
    }

    public int getCost() {
        return cost;
    }

    public boolean mustBeRepeatedForEachColor() {
        return repeatForEachColor;
    }

    public JsonTrumpParameters getParameters() {
        return parameters;
    }

    public String getType() {
        return parameters.getType();
    }

}
