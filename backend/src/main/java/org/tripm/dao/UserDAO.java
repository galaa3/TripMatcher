package org.tripm.dao;

import org.mindrot.jbcrypt.BCrypt;
import org.tripm.beans.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * User Data Access Object
 */
public class UserDAO {

    public boolean registerUser(User user){
        String sql = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";

        try(Connection conn = ConnectionHandler.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){

            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getEmail());

            String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            stmt.setString(3, hashedPassword);

           int rowsAffected = stmt.executeUpdate();
           return rowsAffected > 0;

        } catch (SQLException e){
            System.err.println("Errore durante la registrazione: " + e.getMessage());
            return false;
        }
    }

    /**
     * checks credentials for users login
     * @param username
     * @param plainPassword
     * @return
     */
    public User checkCredentials(String username, String plainPassword){
        User user = null;

        String sql = "SELECT id, username, email, password FROM user WHERE username = ?";

        try (Connection conn = ConnectionHandler.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);

            try (ResultSet rs = stmt.executeQuery()) {
                // if there is a user with that username
                if (rs.next()) {
                    String hashedPassword = rs.getString("password");

                    if (BCrypt.checkpw(plainPassword, hashedPassword)) {

                        user = new User();
                        user.setId(rs.getInt("id"));
                        user.setUsername(rs.getString("username"));
                        user.setEmail(rs.getString("email"));
                    }
                }
            }

        } catch (SQLException e) {
            // In produzione usa un logger (es. SLF4J), per ora stampiamo l'errore
            System.err.println("checkCredentials failed: " + e.getMessage());
        }
        return user;
    }
}
