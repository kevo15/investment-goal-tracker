package com.skillstorm.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.dtos.InvestmentDto;
import com.skillstorm.models.GoalType;
import com.skillstorm.models.InvestmentGoal;
import com.skillstorm.models.Priority;
import com.skillstorm.services.InvestmentService;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
// RequestMapping maps any localhost requests that go through /investment to this controller
@RequestMapping("/investment")
@CrossOrigin(origins = {"http://127.0.0.1:5501", "http://localhost:5501", "http://localhost:4200"})
public class InvestmentController {

    private final InvestmentService service;

    // use the service methods to go through database and retrieve values
    public InvestmentController(InvestmentService service) {
        this.service = service;
    }

    @GetMapping // could take params, but with no params maps any get request that uses /investment to this method
    public ResponseEntity<Page<InvestmentGoal>> getAll(@RequestParam(required = false) String name,
        @RequestParam(required = false) GoalType goalType, @RequestParam(required = false) Priority priority,
        @RequestParam(defaultValue = "0") int page) {                                                   
        
        // added optional params to search by different values
        return service.getAll(name, goalType, priority, page);
    }

    @PostMapping // maps /investment post request to this controller
    public ResponseEntity<InvestmentGoal> createOne(@RequestBody InvestmentDto dto) {        
        return service.createOne(dto);
    }
    
    @PutMapping("/{id}") // takes in an id value that will be used to map the put request to this controller
    public ResponseEntity<InvestmentGoal> updateOne(@PathVariable int id, @RequestBody InvestmentDto dto) {
        return service.updateOne(id, dto);
    }

    @DeleteMapping("/{id}") // maps /investment/id delete request to this controller
    public ResponseEntity<Void> deleteOne(@PathVariable int id) {
        return service.deleteOne(id);
    }
}
