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
public class PossibleSquaresRestTest {

    @Before
    public void setUp() {
        RestAssured.basePath = "http://localhost:8080";
    }

    @Test
    public void testGetPossibleSquares() {
        String json = given()
                .param("card_name", "king")
                .param("card_color", "red")
                .param("player_id", "player")
                .when()
                .get("/DerniereLigneGameEngine/rest/getPossibleSquares").asString();
        assertEquals("[\"#0-8\"]", json);

        json = given()
                .param("card_name", "bishop")
                .param("card_color", "red")
                .param("player_id", "player")
                .when()
                .get("/DerniereLigneGameEngine/rest/getPossibleSquares").asString();

        assertEquals("[\"#2-5\",\"#1-6\"]", json);
    }

    @Test
    public void testGetPossibleSquaresWrongCardName() {
        int status = given()
                .param("card_name", "dorothy")
                .param("card_color", "red")
                .param("player_id", "player")
                .when()
                .get("/DerniereLigneGameEngine/rest/getPossibleSquares")
                .statusCode();
        assertEquals(400, status);
    }

    @Test
    public void testGetPossibleSquaresNoCardName() {
        int status = given()
                .param("card_color", "red")
                .param("player_id", "player")
                .when()
                .get("/DerniereLigneGameEngine/rest/getPossibleSquares")
                .statusCode();
        assertEquals(400, status);
    }

    @Test
    public void testGetPossibleSquaresWrongColor() {
        int status = given()
                .param("card_name", "king")
                .param("card_color", "startgate")
                .param("player_id", "player")
                .when()
                .get("/DerniereLigneGameEngine/rest/getPossibleSquares")
                .statusCode();
        assertEquals(400, status);
    }

    @Test
    public void testGetPossibleSquaresNoColor() {
        int status = given()
                .param("card_name", "king")
                .param("player_id", "player")
                .when()
                .get("/DerniereLigneGameEngine/rest/getPossibleSquares")
                .statusCode();
        assertEquals(400, status);
    }

    @Test
    public void testGetPossibleSquaresWrongPlayer() {
        int status = given()
                .param("card_name", "king")
                .param("card_color", "red")
                .param("player_id", "dorothy")
                .when()
                .get("/DerniereLigneGameEngine/rest/getPossibleSquares")
                .statusCode();
        assertEquals(400, status);
    }

    @Test
    public void testGetPossibleSquaresNoPlayer() {
        int status = given()
                .param("card_name", "king")
                .param("card_color", "red")
                .when()
                .get("/DerniereLigneGameEngine/rest/getPossibleSquares")
                .statusCode();
        assertEquals(400, status);
    }

}
