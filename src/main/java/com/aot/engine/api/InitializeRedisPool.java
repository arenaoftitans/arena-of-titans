/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.aot.engine.api;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class InitializeRedisPool implements ServletContextListener {

    private Redis redis;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        redis = Redis.getInstance();
        ServletContext servletContext = sce.getServletContext();
        servletContext.setAttribute(Redis.REDIS_SERVLET, redis);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        redis.destroy();
    }

}
