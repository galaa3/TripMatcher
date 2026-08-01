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

@WebServlet("api/signup")
public class SignUp extends HttpServlet {
    private final UserDAO userDao = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try{
            BufferedReader reader = req.getReader();
            User newUser = gson.fromJson(reader, User.class);

            if(newUser.getUsername() == null || newUser.getEmail() == null || newUser.getPassword() == null){
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); //400
                out.print("{\"success\": false, \"message\": \"All fields are mandatory.\"}");
                return;
            }

            boolean isRegistered = userDao.registerUser(newUser);
            if(isRegistered){
                resp.setStatus(HttpServletResponse.SC_CREATED); // 201
                out.print("{\"success\": true, \"message\": \"Registration successfully completed.\"}");
            }else {
                resp.setStatus(HttpServletResponse.SC_CONFLICT); // 409
                out.print("{\"success\": false, \"message\": \"Username or email already in use.\"}");
            }
        } catch (Exception e) {
            // handling generic server errors
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            out.print("{\"success\": false, \"message\": \"Internal server error.\"}");
        }

    }
}
