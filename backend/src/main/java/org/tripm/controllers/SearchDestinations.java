package org.tripm.controllers;

import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.tripm.beans.DestCategory;
import org.tripm.beans.Destination;
import org.tripm.beans.User;
import org.tripm.dao.DestinationDAO;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/searchDestinations")
public class SearchDestinations extends HttpServlet {
    private final Gson gson = new Gson();
    private final DestinationDAO destinationDao = new DestinationDAO();

    private static class SearchPayload{
        int month;
        int nights;
        double maxBudget;
        String category;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try{
            BufferedReader reader = req.getReader();
            SearchPayload data = gson.fromJson(reader, SearchPayload.class);

            if (data == null || data.maxBudget <= 0 || data.nights <= 0) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
                out.print("{\"success\": false, \"message\": \"Invalid parameters.\"}");
                return;
            }

            DestCategory categoryEnum = null;
            if(data.category != null){
                categoryEnum = DestCategory.valueOf(data.category.toUpperCase());
            }
            List<Destination> results = destinationDao.findMatchingDestinations(
                    data.month,
                    data.nights,
                    data.maxBudget,
                    categoryEnum
            );

            resp.setStatus(HttpServletResponse.SC_OK); // 200
            String resultsJson = gson.toJson(results);
            out.print("{\"success\": true, \"data\": " + resultsJson + "}");
        }catch (Exception e){
            System.err.println("Error on findMatchingDestinations: " + e.getMessage());
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            out.print("{\"success\": false, \"message\": \"Internal server error.\"}");
        }
    }
}
