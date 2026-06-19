package com.skillstorm.dtos;

import java.time.LocalDate;

import com.skillstorm.models.GoalType;
import com.skillstorm.models.Priority;

// Data Transfer Object used for passing values with no Id
public record InvestmentDto(String name, Double targetAmount, Double currentAmount, 
                            LocalDate targetDate, GoalType goalType, Priority priority
) { }
