package org.tripm.controllers;

import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.tripm.beans.User;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * used by frontend to check if there is a valid session active for a specific user
 */
@WebServlet("/api/me")
public class CheckSession extends HttpServlet{
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        HttpSession session = req.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user != null) {
            resp.setStatus(HttpServletResponse.SC_OK);
            out.print("{\"success\": true, \"user\": " + gson.toJson(user) + "}");
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"success\": false}");
        }
    }

}
