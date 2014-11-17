package com.derniereligne.rest.servlets;

import static com.jayway.restassured.RestAssured.given;
import com.jayway.restassured.response.Response;

class RestTest {

    protected String requestUrl;

    protected Response getResponsePostJson(String json) {
        return given()
                .contentType("application/json")
                .body(json)
                .when()
                .post(requestUrl);
    }

}
