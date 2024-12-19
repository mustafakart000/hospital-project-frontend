package com.hospital.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;


// JWT token işlemlerini yöneten yardımcı sınıf
@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    
    private Key key;
    
    @PostConstruct
    public void init() {
        // Gizli anahtarı kullanarak bir Key oluşturur

        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        key = Keys.hmacShaKeyFor(keyBytes);
    }
    
    public String generateToken(String username) {
        // Kullanıcı adı için bir JWT token oluşturur
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractUsername(String token) {
        // Token'dan kullanıcı adını çıkarır
        return extractClaims(token).getSubject();
    }

    private Claims extractClaims(String token) {
        // Token'dan iddiaları çıkarır bu ne demek? token içindeki bilgileri çıkarır. hangi bilgileri çıkarıyoruz?
       

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token) {
        // Token'ın geçerliliğini kontrol eder
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            logger.error("Token doğrulama hatası: " + e.getMessage());
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        // Token'dan kullanıcı adını alır
        return extractUsername(token);
    }
}