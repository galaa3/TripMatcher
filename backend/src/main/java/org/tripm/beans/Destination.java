package org.tripm.beans;

public class Destination {
    private int id;
    private String city;
    private DestCategory category;
    private String Description;
    private String imageUrl;

    private double avgFlight;
    private double avgAccomodation;
    private double totalEstimatedCost;

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
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
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
}
