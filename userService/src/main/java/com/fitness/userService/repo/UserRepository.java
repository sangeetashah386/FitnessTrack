package com.fitness.userService.repo;

import com.fitness.userService.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    boolean existsByKeycloakId(String keycloakId);
    Optional<User> findByKeycloakId(String keycloakId);

    User findByEmail(String email);
}