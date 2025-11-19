package com.fitness.gateway.exception;

public class DownstreamServiceException extends RuntimeException{
    public DownstreamServiceException(String message) { super(message); }
}
