package com.fitness.gateway.exception;

public class MyClientErrorException extends RuntimeException{
    public MyClientErrorException(String message) {
        super(message);
    }
}
