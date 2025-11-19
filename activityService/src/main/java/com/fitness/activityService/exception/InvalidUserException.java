package com.fitness.activityService.exception;

public class InvalidUserException extends RuntimeException{
    public InvalidUserException(String userId){
        super("User with ID " + userId + " does not exist.");
    }
}
