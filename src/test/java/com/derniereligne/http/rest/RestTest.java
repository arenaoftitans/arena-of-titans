package com.derniereligne.http.rest;

import com.jayway.restassured.RestAssured;
import static com.jayway.restassured.RestAssured.given;
import com.jayway.restassured.response.Response;
import com.jayway.restassured.specification.RequestSpecification;
import java.util.HashMap;

class RestTest {

    protected static final String SESSION_ID = "JSESSIONID";
    protected static final String CARD_NAME_KEY = "card_name";
    protected static final String COLOR_NAME_KEY = "card_color";
    protected static final String PLAYER_ID_KEY = "player_id";
    protected String requestUrl;
    protected String jsonCreateTwoPlayersGame;
    protected String createGameUrl = "/DerniereLigneGameEngine/rest/createGame";
    protected String jSessionId;
    protected HashMap<String, String> defaultParameters;

    public RestTest() {
        RestAssured.basePath = "http://localhost:8080";
        jsonCreateTwoPlayersGame = "[{\"index\":0,\"name\":\"Toto\"},{\"index\":1,\"name\":\"Titi\"}]";
    }

    protected Response getResponsePostJson(String json) {
        return given()
                .contentType("application/json")
                .body(json)
                .when()
                .post(requestUrl);
    }

    protected void createGame() {
        jSessionId = given()
                .contentType("application/json")
                .body(jsonCreateTwoPlayersGame)
                .when()
                .post(createGameUrl)
                .getCookie(SESSION_ID);
    }

    protected Response getReponseGetJson(HashMap<String, String> parameters) {
        RequestSpecification requestSpecification = given().cookie(SESSION_ID, jSessionId);

        parameters.entrySet().stream().forEach((entry) -> {
            requestSpecification.param(entry.getKey(), entry.getValue());
        });

        return requestSpecification.when().get(requestUrl);
    }

}
