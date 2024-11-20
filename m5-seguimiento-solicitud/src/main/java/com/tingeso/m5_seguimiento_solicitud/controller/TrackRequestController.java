package com.tingeso.m5_seguimiento_solicitud.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/track-request")
@CrossOrigin("*")
public class TrackRequestController {

    @GetMapping("/example")
    public String example(){return "test de m5-seguimiento-solicitud";}
}
