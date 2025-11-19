package com.fitness.nutritionService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication

public class NutritionServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(NutritionServiceApplication.class, args);
	}

}
