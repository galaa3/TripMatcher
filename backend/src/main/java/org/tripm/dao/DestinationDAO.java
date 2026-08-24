package org.tripm.dao;

import org.tripm.beans.DestCategory;
import org.tripm.beans.Destination;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DestinationDAO {

    /**
     * Matches destinations based of user needs
     * @param month
     * @param nights
     * @param maxBudget
     * @param category
     * @return
     */
    public List<Destination> findMatchingDestinations(int month, int nights, double maxBudget, DestCategory category){
        List<Destination> results = new ArrayList<>();

        String sql = """
                SELECT d.id, d.city, d.category, d.description, d.image_url, 
                pt.avg_flight_per_person, pt.avg_accomodation_per_night,
                (pt.avg_flight_per_person + (pt.avg_accomodation_per_night * ?)) AS total_cost
                FROM destination d JOIN price_trends pt ON d.id = pt.destination_id
                WHERE pt.reference_month = ? 
                AND (pt.avg_flight_per_person + (pt.avg_accomodation_per_night * ?)) <= ?  
                """;

        boolean hasCategory = category != null;
        if(hasCategory){
           sql += " AND d.category = ? " +
                   " ORDER BY total_cost ASC";
        }

        try(Connection conn = ConnectionHandler.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)){
            stmt.setInt(1, nights);
            stmt.setInt(2, month);
            stmt.setInt(3, nights);
            stmt.setDouble(4, maxBudget);

            if(hasCategory)
                stmt.setString(5, category.name());

            try(ResultSet rs = stmt.executeQuery()){
                while(rs.next()){
                    Destination dest = new Destination();
                    dest.setId(rs.getInt("id"));
                    dest.setCity(rs.getString("city"));
                    String categoryStr = rs.getString("category");
                    if(categoryStr != null && !categoryStr.trim().isEmpty())
                        dest.setCategory(DestCategory.valueOf(categoryStr));
                    dest.setDescription(rs.getString("description"));
                    dest.setImageUrl(rs.getString("image_url"));
                    dest.setAvgFlight(rs.getDouble("avg_flight_per_person"));
                    dest.setAvgAccomodation(rs.getDouble("avg_accomodation_per_night"));
                    dest.setTotalEstimatedCost(rs.getDouble("total_cost"));

                    results.add(dest);
                }
            }

        }catch (SQLException e){
            System.err.println("destination matching failed: " + e.getMessage());
        }
        return results;
    }
}
