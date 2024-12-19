package com.hospital.repository;

import com.hospital.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Kullanıcı veritabanı işlemleri için JPA deposu
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByTcKimlik(String tcKimlik); // Kullanıcı adını kullanarak kullanıcıyı bulur
    boolean existsByEmail(String email);
    boolean existsByTcKimlik(String tcKimlik);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}