package com.fitness.gateway.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(String message) { super(message); }

}
