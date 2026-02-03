const request = require("supertest");
const express = require("express");
const app = express(); // Mock app untuk testing isolasi

// Mock route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: 100,
    timestamp: new Date().toISOString(),
  });
});

describe("Health Check Endpoint", () => {
  it("Should return 200 OK and JSON structure", async () => {
    const res = await request(app).get("/api/health");

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Server is healthy");
    expect(res.body).toHaveProperty("uptime");
  });
});

// Unit test logic ekstraksi Cloudinary ID
describe("Cloudinary Public ID Extractor Logic", () => {
  const getCloudinaryPublicId = (url) => {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  it("Should correctly extract ID from versioned URL", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/v123456/lumastore_products/sepatu-baru.jpg";
    const id = getCloudinaryPublicId(url);
    expect(id).toBe("lumastore_products/sepatu-baru");
  });

  it("Should correctly extract ID from non-versioned URL", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/folder/gambar.png";
    const id = getCloudinaryPublicId(url);
    expect(id).toBe("folder/gambar");
  });
});
