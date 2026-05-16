package com.collincorp.houserental.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Redirects all non-API and non-file routes to index.html for SPA routing.
 */
@Controller
public class ViewController {

    @RequestMapping(value = { "/", "/{path:[^\\.]*}" })
    public String forward() {
        return "forward:/index.html";
    }
}
