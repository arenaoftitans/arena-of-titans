/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.http.rest;

import com.google.gson.Gson;
import com.jayway.restassured.response.Response;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author jenselme
 */
public class CreateGameRestIT extends RestTest {

    private final String jsonCreateTwoPlayersNoEmptyPlayers;
    private final String jsonCreateTwoPlayers;
    private final String notEngoughPlayersJsonResponse;
    private static final String ID_FIRST_PLAYER = "0";
    private static final String NAME_FIRST_PLAYER = "Toto";
    private static final int NUMBER_CARDS_IN_HAND = 5;

    public CreateGameRestIT() {
        requestUrl = "/aot/rest/createGame";
        jsonCreateTwoPlayersNoEmptyPlayers = "[{\"index\":0,\"name\":\"Toto\"},{\"index\":1,\"name\":\"Titi\"}]";
        notEngoughPlayersJsonResponse = "{\"error_to_display\": \"Not enough players. 2 Players at least are required to start a game\"}";
        jsonCreateTwoPlayers = "[{\"index\":0,\"name\":\"Toto\"},{\"index\":1,\"name\":\"Titi\"},{\"index\":2,\"name\":\"\"},{\"index\":3,\"name\":\"\"},{\"index\":4,\"name\":\"\"},{\"index\":5,\"name\":\"\"},{\"index\":6,\"name\":\"\"},{\"index\":7,\"name\":\"\"}]";
    }

    @Test
    public void createGameTwoPlayersEmptyPlayers() {
        Response res = getResponsePostJson(jsonCreateTwoPlayers);
        test(res);
    }

    @Test
    public void createGameTwoPlayersNoEmptyPlayers() {
        String json = jsonCreateTwoPlayersNoEmptyPlayers;
        Response res = getResponsePostJson(json);
        test(res);
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
        test(res);
    }

    private void test(Response res) {
        assertEquals(200, res.statusCode());
        Gson gson = new Gson();
        CardPlayedJsonResponse cardPlayedJsonResponse = gson.fromJson(res.asString(), CardPlayedJsonResponse.class);
        assertEquals(ID_FIRST_PLAYER, cardPlayedJsonResponse.getNextPlayerId());
        assertEquals(NAME_FIRST_PLAYER, cardPlayedJsonResponse.getNextPlayerName());
        assertEquals(NUMBER_CARDS_IN_HAND, cardPlayedJsonResponse.getNumberCardsNextPlayer());
        assertFalse(cardPlayedJsonResponse.getTrumpsNextPlayer().isEmpty());
    }

}
