package org.tripm.controllers;

import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.tripm.beans.User;
import org.tripm.dao.UserDAO;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/api/signin")
public class SignIn extends HttpServlet {
    private final UserDAO userDao = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try{
            BufferedReader reader = req.getReader();
            User possibleUser = gson.fromJson(reader, User.class);

            if (possibleUser == null || possibleUser.getUsername() == null || possibleUser.getPassword() == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
                out.print("{\"success\": false, \"message\": \"All fields are mandatory.\"}");
                return;
            }

            User loggedUser = userDao.checkCredentials(possibleUser.getUsername(), possibleUser.getPassword());

            if (loggedUser != null) {
                resp.setStatus(HttpServletResponse.SC_OK); // 200

                loggedUser.setPassword(null);
                String userJson = gson.toJson(loggedUser);
                out.print("{\"success\": true, \"user\": " + userJson + "}");
            } else {
                // Login failed
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                out.print("{\"success\": false, \"message\": \"invalid credentials.\"}");
            }

        } catch (Exception e) {
            System.err.println("SignIn error: " + e.getMessage());
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            out.print("{\"success\": false, \"message\": \"Internal server error.\"}");
        }
    }
}
