/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.rest.servlets;

import com.jayway.restassured.response.Response;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author jenselme
 */
public class CreateGameRestIT extends RestTest {

    private final String twoPlayersCorrectlyCreatedJsonResponse;
    private final String notEngoughPlayersJsonResponse;

    public CreateGameRestIT() {
        requestUrl = "/DerniereLigneGameEngine/rest/createGame";
        twoPlayersCorrectlyCreatedJsonResponse = "[{\"index\":0,\"name\":\"Toto\"},{\"index\":1,\"name\":\"Titi\"}]";
        notEngoughPlayersJsonResponse = "{\"error_to_display\": \"Not enough players. 2 Players at least are required to start a game\"}";
    }

    @Test
    public void createGameTwoPlayersEmptyPlayers() {
        String json = "[{\"index\":0,\"name\":\"Toto\"},{\"index\":1,\"name\":\"Titi\"},{\"index\":2,\"name\":\"\"},{\"index\":3,\"name\":\"\"},{\"index\":4,\"name\":\"\"},{\"index\":5,\"name\":\"\"},{\"index\":6,\"name\":\"\"},{\"index\":7,\"name\":\"\"}]";
        Response res = getResponsePostJson(json);
        assertEquals(200, res.statusCode());
        assertEquals(twoPlayersCorrectlyCreatedJsonResponse, res.asString());
    }

    @Test
    public void createGameTwoPlayersNoEmptyPlayers() {
        String json = twoPlayersCorrectlyCreatedJsonResponse; // The request and its answer are the same.
        Response res = getResponsePostJson(json);
        assertEquals(200, res.statusCode());
        assertEquals(twoPlayersCorrectlyCreatedJsonResponse, res.asString());
    }

    @Test
    public void createGameNoPlayer() {
        String json = "[]";
        Response res = getResponsePostJson(json);
        assertEquals(400, res.statusCode());
        assertEquals(notEngoughPlayersJsonResponse, res.asString());
    }

    @Test
    public void createGameOnePlayer() {
        String json = "[{\"index\":1,\"name\":\"Toto\"}]";
        Response res = getResponsePostJson(json);
        assertEquals(400, res.statusCode());
        assertEquals(notEngoughPlayersJsonResponse, res.asString());
    }

    @Test
    public void createGameTwoPlayersNonConsecutive() {
        String json = "[{\"index\":1,\"name\":\"Toto\"},{\"index\":2,\"name\":\"\"},{\"index\":3,\"name\":\"Titi\"}]";
        Response res = getResponsePostJson(json);
        assertEquals(200, res.statusCode());
        assertEquals(twoPlayersCorrectlyCreatedJsonResponse, res.asString());
    }

}
