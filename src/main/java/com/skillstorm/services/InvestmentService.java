package com.skillstorm.services;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.skillstorm.dtos.InvestmentDto;
import com.skillstorm.models.GoalType;
import com.skillstorm.models.InvestmentGoal;
import com.skillstorm.models.Priority;
import com.skillstorm.repositories.InvestmentRepository;

@Service
public class InvestmentService {

    // connects to repo and uses methods from the CRUD repository
    private final InvestmentRepository repo;

    public InvestmentService(InvestmentRepository repo) {
        this.repo = repo;
    }

    // wrap return in ResponseEntity to provide Web Response codes
    public ResponseEntity<Iterable<InvestmentGoal>> getAll(String name, GoalType goalType, Priority priority) {
        if (name == null && goalType == null && priority == null) {
            return ResponseEntity.ok(this.repo.findAll()); // findAll is one of those pre created methods
        } else if (name != null) {
            // added a custom method to find a Investment Goal by name
            return ResponseEntity.ok(this.repo.findByNameStartsWith(name));
        } else if (goalType != null){
            // added a custom method to find a Investment Goal by goal type
            return ResponseEntity.ok(this.repo.findByGoalType(goalType));
        }
        // added a custom method to find a Investment Goal by priority
        return ResponseEntity.ok(this.repo.findByPriority(priority));
    }

    // create and update methods will need a InvestmentDto so id value will not be provided
    public ResponseEntity<InvestmentGoal> createOne(InvestmentDto dto) {

        InvestmentGoal goal = this.repo.save(new InvestmentGoal(0, dto.name(), dto.targetAmount(), 
        dto.currentAmount(), dto.targetDate(), dto.goalType(), dto.priority()));

        return ResponseEntity.status(201).body(goal);
    }

    public ResponseEntity<InvestmentGoal> updateOne(int id, InvestmentDto dto) {

        if(this.repo.existsById(id)) {
            InvestmentGoal temp = this.repo.findById(id).get();

                // Error handling checking for past dates and negative values, giving a 400 error if provided
                if((dto.targetDate() != null && dto.targetDate().isBefore(LocalDate.now())) ||
                    (dto.currentAmount() != null && dto.currentAmount() < 0) ||
                    (dto.targetAmount() != null && dto.targetAmount() < 0)) {
                    return ResponseEntity.badRequest().build();
                }

                // Error handling to allow for only partial Investment Goal inputs if no value are provided previous values are used
                if(dto.name() != null) temp.setName(dto.name());
                if(dto.targetAmount() != null) temp.setTargetAmount(dto.targetAmount());
                if(dto.currentAmount() != null) temp.setCurrentAmount(dto.currentAmount());
                if(dto.targetDate() != null) temp.setTargetDate(dto.targetDate());
                if(dto.goalType() != null) temp.setGoalType(dto.goalType());
                if(dto.priority() != null) temp.setPriority(dto.priority());

            InvestmentGoal updated = this.repo.save(temp);
            
            return ResponseEntity.ok().body(updated);
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<Void> deleteOne(int id) {
        this.repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
