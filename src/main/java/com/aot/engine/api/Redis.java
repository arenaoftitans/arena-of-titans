package com.aot.engine.api;

public class Redis {

    public static final String GAME_KEY_PART = "game:";
    public static final String MATCH_KEY = "match";
    // time in seconds after which the game is deleted (48h).
    public static final int GAME_EXPIRE = 172_800;
    public static final String SERVER_HOST = "localhost";

}
