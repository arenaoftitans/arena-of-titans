/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.http.rest;

import static com.derniereligne.http.rest.RestTest.CARD_NAME_KEY;
import com.jayway.restassured.response.Response;
import java.util.HashMap;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

/**
 *
 * @author jenselme
 */
public class PlayRestIT extends RestTest {

    @Before
    public void setUp() {
        requestUrl = "/DerniereLigneGameEngine/rest/play";
        createGame();

        defaultParameters = new HashMap<>();
        defaultParameters.put(CARD_NAME_KEY, "king");
        defaultParameters.put(COLOR_NAME_KEY, "red");
        defaultParameters.put(PLAYER_ID_KEY, "0");
    }

    @Test
    public void testPlayNoSquare() {
        Response response = getReponseGetJson(defaultParameters);
        assertEquals(400, response.getStatusCode());
        assertEquals("{\"error\": \"Wrong input parameters. CardName: king. CardColor: red. PlayerId: 0. X: null. Y: null.\"}",
                response.asString());
    }

}
