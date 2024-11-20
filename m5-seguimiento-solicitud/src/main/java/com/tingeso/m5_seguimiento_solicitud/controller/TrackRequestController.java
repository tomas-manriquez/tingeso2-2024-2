package com.tingeso.m5_seguimiento_solicitud.controller;

import com.tingeso.m5_seguimiento_solicitud.service.TrackRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/track-request")
@CrossOrigin("*")
public class TrackRequestController {
    @Autowired
    TrackRequestService trackRequestService;

    @GetMapping("/example")
    public String example(){return "test de m5-seguimiento-solicitud";}

    @GetMapping("/{id}")
    public String trackRequest(@PathVariable Long id){return trackRequestService.requestTracking(id);}
}
