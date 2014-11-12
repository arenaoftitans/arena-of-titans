/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.derniereligne.rest.servlets;

import com.jayway.restassured.RestAssured;
import static com.jayway.restassured.RestAssured.given;

import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author jenselme
 */
public class PlayTest {

    @Before
    public void setUp() {
        RestAssured.basePath = "http://localhost:8080";
    }

    @Test
    public void hi() {
        String json = given().param("card", "king").param("color", "red").param("x", "0").param("y", "8").when()
                .get("/DerniereLigneGameEngine/rest/play").asString();
        assertEquals("[\"#0-7\"]", json);
    }

}
