package com.derniereligne.rest.servlets;

import com.jayway.restassured.RestAssured;
import static com.jayway.restassured.RestAssured.given;
import com.jayway.restassured.response.Response;
import com.jayway.restassured.specification.RequestSpecification;
import java.util.HashMap;

class RestTest {

    protected static final String SESSION_ID = "JSESSIONID";
    protected String requestUrl;
    protected String jsonCreateTwoPlayersGame;
    protected String createGameUrl = "/DerniereLigneGameEngine/rest/createGame";
    protected String jSessionId;

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
