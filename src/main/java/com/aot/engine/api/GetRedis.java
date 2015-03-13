package com.aot.engine.api;

import javax.servlet.http.HttpSession;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

public class GetRedis extends ServerEndpointConfig.Configurator {

    @Override
    public void modifyHandshake(ServerEndpointConfig config,
            HandshakeRequest request,
            HandshakeResponse response) {
        HttpSession httpSession = (HttpSession) request.getHttpSession();
        Redis redis = (Redis) httpSession.getServletContext().getAttribute(Redis.REDIS_SERVLET);
        config.getUserProperties().put(Redis.REDIS_SERVLET, redis);
    }

}
