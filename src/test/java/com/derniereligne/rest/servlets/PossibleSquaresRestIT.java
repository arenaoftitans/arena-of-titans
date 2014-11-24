/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.rest.servlets;

import com.jayway.restassured.response.Response;
import java.util.HashMap;

import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author jenselme
 */
public class PossibleSquaresRestIT extends RestTest {

    private HashMap<String, String> defaultParameters;

    @Before
    public void setUp() {
        requestUrl = "/DerniereLigneGameEngine/rest/getPossibleSquares";
        createGame();

        defaultParameters = new HashMap<>();
        defaultParameters.put("card_name", "king");
        defaultParameters.put("card_color", "red");
        defaultParameters.put("player_id", "0");
    }

    @Test
    public void testGetPossibleSquaresBasicMovePlayer0() {
        Response response = getReponseGetJson(defaultParameters);
        assertEquals(200, response.statusCode());
        assertEquals("[\"square-0-7\"]", response.asString());
    }

    @Test
    public void testGetPossibleSquaresNoSquare() {
        defaultParameters.put("card_name", "bishop");
        Response response = getReponseGetJson(defaultParameters);

        assertEquals(200, response.statusCode());
        assertEquals("[]", response.asString());
    }

    @Test
    public void testGetPossibleSquaresWrongCardName() {
        defaultParameters.put("card_name", "dorothy");
        Response res = getReponseGetJson(defaultParameters);
        assertEquals(400, res.statusCode());
        assertEquals("{\"error\": \"Cannot get the selected card: dorothy, red.\"}", res.asString());
    }

    @Test
    public void testGetPossibleSquaresNoCardName() {
        defaultParameters.remove("card_name");
        Response response = getReponseGetJson(defaultParameters);
        assertEquals(400, response.statusCode());
        assertEquals("{\"error\": \"Wrong input parameters. CardName: null. CardColor: red. PlayerId: 0.\"}", response.asString());
    }

    @Test
    public void testGetPossibleSquaresWrongColor() {
        defaultParameters.put("card_color", "startgate");
        Response response = getReponseGetJson(defaultParameters);
        assertEquals(400, response.statusCode());
        assertEquals("{\"error\": \"Cannot get the selected card: king, startgate.\"}", response.asString());
    }

    @Test
    public void testGetPossibleSquaresNoColor() {
        defaultParameters.remove("card_color");
        Response response = getReponseGetJson(defaultParameters);
        assertEquals(400, response.statusCode());
        assertEquals("{\"error\": \"Wrong input parameters. CardName: king. CardColor: null. PlayerId: 0.\"}", response.asString());
    }

    @Test
    public void testGetPossibleSquaresWrongPlayer() {
        defaultParameters.put("player_id", "dorothy");
        Response response = getReponseGetJson(defaultParameters);
        assertEquals(400, response.statusCode());
        assertEquals("{\"error\": \"Wrong input parameters. CardName: king. CardColor: red. PlayerId: dorothy.\"}", response.asString());
    }

    @Test
    public void testGetPossibleSquaresNoPlayer() {
        defaultParameters.remove("player_id");
        Response response = getReponseGetJson(defaultParameters);
        assertEquals(400, response.statusCode());
        assertEquals("{\"error\": \"Wrong input parameters. CardName: king. CardColor: red. PlayerId: null.\"}", response.asString());
    }

}
