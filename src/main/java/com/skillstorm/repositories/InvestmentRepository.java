package com.skillstorm.repositories;

import org.springframework.data.repository.CrudRepository;

import com.skillstorm.models.GoalType;
import com.skillstorm.models.InvestmentGoal;
import com.skillstorm.models.Priority;

import java.util.List;


// repo used to get useful methods for CRUD operations
public interface InvestmentRepository extends CrudRepository<InvestmentGoal, Integer>{ // CrudRepository takes the entity, and primary key type

    // does not need methods but there is the ability to create custom methods when needed

    // added custom methods to find by different columns
    Iterable<InvestmentGoal> findByNameStartsWith(String name);
    List<InvestmentGoal> findByGoalType(GoalType goalType);
    List<InvestmentGoal> findByPriority(Priority priority);

}
