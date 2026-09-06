package org.tripm.beans;

public class Destination {
    private int id;
    private String city;
    private DestCategory category;
    private String description;
    private String imageUrl;

    private double avgFlight;
    private double avgAccomodation;
    private double totalEstimatedCost;
    private String iataCode;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public DestCategory getCategory() {
        return category;
    }

    public void setCategory(DestCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getAvgFlight() {
        return avgFlight;
    }

    public void setAvgFlight(double avgFlight) {
        this.avgFlight = avgFlight;
    }

    public double getAvgAccomodation() {
        return avgAccomodation;
    }

    public void setAvgAccomodation(double avgAccomodation) {
        this.avgAccomodation = avgAccomodation;
    }

    public double getTotalEstimatedCost() {
        return totalEstimatedCost;
    }

    public void setTotalEstimatedCost(double totalEstimatedCost) {
        this.totalEstimatedCost = totalEstimatedCost;
    }

    public String getIataCode() {
        return iataCode;
    }

    public void setIataCode(String iataCode) {
        this.iataCode = iataCode;
    }
}
