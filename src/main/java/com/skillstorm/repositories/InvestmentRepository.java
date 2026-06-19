package com.skillstorm.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.skillstorm.models.GoalType;
import com.skillstorm.models.InvestmentGoal;
import com.skillstorm.models.Priority;

// repo used to get useful methods for CRUD operations
public interface InvestmentRepository extends CrudRepository<InvestmentGoal, Integer>, PagingAndSortingRepository<InvestmentGoal, Integer>{ // CrudRepository takes the entity, and primary key type

    // does not need methods but there is the ability to create custom methods when needed

    // added custom methods to find by different columns
    Page<InvestmentGoal> findByNameStartsWith(String name, Pageable pageable);
    Page<InvestmentGoal> findByGoalType(GoalType goalType, Pageable pageable);
    Page<InvestmentGoal> findByPriority(Priority priority, Pageable pageable);

}
