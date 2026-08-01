package org.tripm.dao;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * handles database connection
 */
public class ConnectionHandler {

    // Loading environment variables: Dotenv will read before cloud variables if they are
    private static final Dotenv dotenv = Dotenv.load();

    /**
     *
     * @return connection to database
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {

        String dbHost = dotenv.get("DB_HOST") != null ? dotenv.get("DB_HOST") : "localhost";
        String dbPort = dotenv.get("DB_PORT") != null ? dotenv.get("DB_PORT") : "3306";
        String dbName = dotenv.get("DB_NAME") != null ? dotenv.get("DB_NAME") : "tripm";

        String dbUser = dotenv.get("DB_USER");
        String dbPassword = dotenv.get("DB_PASSWORD");

        // Building connection url
        String jdbcUrl = "jdbc:mysql://" + dbHost + ":" + dbPort + "/" + dbName + "?serverTimezone=UTC";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("Errore critico: Driver MySQL non trovato. Verifica il pom.xml!");
            throw new SQLException("Driver non trovato", e);
        }

        return DriverManager.getConnection(jdbcUrl, dbUser, dbPassword);
    }
}
