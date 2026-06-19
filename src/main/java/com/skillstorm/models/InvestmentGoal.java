package com.skillstorm.models;

import java.time.LocalDate;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class InvestmentGoal {

    @Id // Sets the Primary Key of the Table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Makes the value auto_generated?
    private int id;

    // Other columns within the table that are matched one to one
    @Length(min = 3, max = 32)
    private String name;

    @PositiveOrZero
    private Double targetAmount;

    @PositiveOrZero
    private Double currentAmount;

    @Future
    private LocalDate targetDate;

    @Enumerated(EnumType.ORDINAL) // Assigns ordinal value to database
    private GoalType goalType;

    @Enumerated(EnumType.ORDINAL) // Assigns ordinal value to database
    private Priority priority;

    public InvestmentGoal() {
    }
    public InvestmentGoal(int id, String name, Double targetAmount, Double currentAmount, LocalDate targetDate,
            GoalType goalType, Priority priority) {
        this.id = id;
        this.name = name;
        this.targetAmount = targetAmount;
        this.currentAmount = currentAmount;
        this.targetDate = targetDate;
        this.goalType = goalType;
        this.priority = priority;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Double getTargetAmount() {
        return targetAmount;
    }
    public void setTargetAmount(Double targetAmount) {
        this.targetAmount = targetAmount;
    }
    public Double getCurrentAmount() {
        return currentAmount;
    }
    public void setCurrentAmount(Double currentAmount) {
        this.currentAmount = currentAmount;
    }
    public LocalDate getTargetDate() {
        return targetDate;
    }
    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }
    public GoalType getGoalType() {
        return goalType;
    }
    public void setGoalType(GoalType goalType) {
        this.goalType = goalType;
    }
    public Priority getPriority() {
        return priority;
    }
    public void setPriority(Priority priority) {
        this.priority = priority;
    }
    
}
