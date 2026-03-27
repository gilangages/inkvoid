// backend/tests/visit.test.js
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

// ====================================================================
// UNIT TEST 1: Logika Parsing User-Agent (Tanpa DB, Pure Function Test)
// ====================================================================
describe("UA Parser Logic", () => {
  // Import langsung helper function dari controller
  const { _parseUserAgent } = require("../controllers/visitController");

  it("should parse Android Chrome user-agent correctly", () => {
    const ua =
      "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
    const result = _parseUserAgent(ua);

    expect(result.os).toBe("Android");
    expect(result.browser).toBe("Mobile Chrome");
    expect(result.device_type).toBe("Mobile");
  });

  it("should parse iPhone Safari user-agent correctly", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1";
    const result = _parseUserAgent(ua);

    expect(result.os).toBe("iOS");
    expect(result.browser).toBe("Mobile Safari");
    expect(result.device_type).toBe("Mobile");
  });

  it("should parse Windows Firefox user-agent correctly", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0";
    const result = _parseUserAgent(ua);

    expect(result.os).toBe("Windows");
    expect(result.browser).toBe("Firefox");
    expect(result.device_type).toBe("Desktop");
  });

  it("should parse Mac Chrome user-agent correctly", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    const result = _parseUserAgent(ua);

    expect(result.os).toBe("macOS");
    expect(result.browser).toBe("Chrome");
    expect(result.device_type).toBe("Desktop");
  });

  it("should handle empty/null user-agent gracefully", () => {
    const result1 = _parseUserAgent("");
    expect(result1.os).toBe("Unknown");
    expect(result1.browser).toBe("Unknown");
    expect(result1.device_type).toBe("Desktop"); // Default ke Desktop

    const result2 = _parseUserAgent(null);
    expect(result2.os).toBe("Unknown");
    expect(result2.browser).toBe("Unknown");
    expect(result2.device_type).toBe("Desktop");
  });

  it("should parse iPad user-agent as Mobile", () => {
    const ua =
      "Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1";
    const result = _parseUserAgent(ua);

    expect(result.device_type).toBe("Mobile"); // Tablet = Mobile
  });
});

// ====================================================================
// UNIT TEST 2: API Endpoints (Mock DB)
// ====================================================================
describe("Visit API Endpoints", () => {
  let app;

  // Mock database
  const mockDb = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Mock database module
    jest.mock("../config/database", () => mockDb);

    // Re-require setelah mock
    const visitController = require("../controllers/visitController");
    const verifyToken = require("../middleware/authMiddleware");

    app = express();
    app.use(bodyParser.json());

    // Setup routes (sama persis dengan visitRoutes.js)
    app.post("/api/visits", visitController.recordVisit);
    app.get("/api/visits/stats", verifyToken, visitController.getStats);
    app.get("/api/visits/list", verifyToken, visitController.getVisitors);
    app.delete("/api/visits/all", verifyToken, visitController.deleteAllVisitors);
    app.delete("/api/visits/:id", verifyToken, visitController.deleteVisitor);
  });

  // --- Helper: Generate fake JWT token ---
  const jwt = require("jsonwebtoken");
  const secret = process.env.JWT_SECRET || "rahasia_negara_luma";
  const fakeToken = jwt.sign({ role: "admin", email: "test@test.com" }, secret, { expiresIn: "1h" });

  // ========= recordVisit =========
  describe("POST /api/visits (recordVisit)", () => {
    it("should record a visit with device info and return 200", async () => {
      mockDb.execute.mockResolvedValue([{ insertId: 1 }]);

      const res = await request(app)
        .post("/api/visits")
        .set(
          "User-Agent",
          "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36"
        );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Visit recorded");

      // Pastikan db.execute dipanggil dengan parameter yang benar
      expect(mockDb.execute).toHaveBeenCalledTimes(1);
      const callArgs = mockDb.execute.mock.calls[0];
      expect(callArgs[0]).toContain("INSERT INTO visits");
      // Parameter: [ip, userAgent, os, device_type, browser]
      expect(callArgs[1]).toHaveLength(5);
      expect(callArgs[1][2]).toBe("Android"); // os
      expect(callArgs[1][3]).toBe("Mobile"); // device_type
      expect(callArgs[1][4]).toBe("Mobile Chrome"); // browser
    });

    it("should return 500 on database error", async () => {
      mockDb.execute.mockRejectedValue(new Error("DB connection lost"));

      const res = await request(app).post("/api/visits");

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  // ========= getStats =========
  describe("GET /api/visits/stats (getStats)", () => {
    it("should return stats with total_views and unique_visitors", async () => {
      mockDb.execute
        .mockResolvedValueOnce([[{ total: 184 }]]) // Total views
        .mockResolvedValueOnce([[{ unique_visitors: 50 }]]); // Unique

      const res = await request(app)
        .get("/api/visits/stats")
        .set("Authorization", `Bearer ${fakeToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total_views).toBe(184);
      expect(res.body.data.unique_visitors).toBe(50);
    });

    it("should reject request without auth token", async () => {
      const res = await request(app).get("/api/visits/stats");

      expect(res.statusCode).toBe(401);
    });
  });

  // ========= getVisitors (with pagination) =========
  describe("GET /api/visits/list (getVisitors)", () => {
    it("should return paginated visitor list (default page=1, limit=10)", async () => {
      const mockVisitors = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        ip_address: `192.168.1.${i}`,
        user_agent: "Mozilla/5.0",
        os: "Android",
        device_type: "Mobile",
        browser: "Chrome",
        visit_time: "2026-03-27T00:00:00Z",
      }));

      mockDb.execute
        .mockResolvedValueOnce([[{ total: 50 }]]) // COUNT
        .mockResolvedValueOnce([mockVisitors]); // SELECT with LIMIT

      const res = await request(app)
        .get("/api/visits/list")
        .set("Authorization", `Bearer ${fakeToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(10);
      expect(res.body.pagination.current_page).toBe(1);
      expect(res.body.pagination.total_pages).toBe(5);
      expect(res.body.pagination.total_data).toBe(50);
      expect(res.body.pagination.per_page).toBe(10);
    });

    it("should respect page and limit query params", async () => {
      mockDb.execute
        .mockResolvedValueOnce([[{ total: 50 }]])
        .mockResolvedValueOnce([[]]);

      const res = await request(app)
        .get("/api/visits/list?page=3&limit=5")
        .set("Authorization", `Bearer ${fakeToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.current_page).toBe(3);
      expect(res.body.pagination.per_page).toBe(5);
      expect(res.body.pagination.total_pages).toBe(10); // 50 / 5

      // Pastikan OFFSET dihitung benar: (3-1) * 5 = 10
      const callArgs = mockDb.execute.mock.calls[1];
      expect(callArgs[0]).toContain("LIMIT 5 OFFSET 10");
    });

    it("should reject request without auth token", async () => {
      const res = await request(app).get("/api/visits/list");
      expect(res.statusCode).toBe(401);
    });
  });

  // ========= deleteVisitor =========
  describe("DELETE /api/visits/:id (deleteVisitor)", () => {
    it("should delete a visitor by ID and return 200", async () => {
      mockDb.execute
        .mockResolvedValueOnce([[{ id: 5 }]]) // SELECT (exists)
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // DELETE

      const res = await request(app)
        .delete("/api/visits/5")
        .set("Authorization", `Bearer ${fakeToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("berhasil dihapus");
    });

    it("should return 404 if visitor ID not found", async () => {
      mockDb.execute.mockResolvedValueOnce([[]]); // SELECT (empty = not found)

      const res = await request(app)
        .delete("/api/visits/999")
        .set("Authorization", `Bearer ${fakeToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("tidak ditemukan");
    });

    it("should reject request without auth token", async () => {
      const res = await request(app).delete("/api/visits/5");
      expect(res.statusCode).toBe(401);
    });
  });

  // ========= deleteAllVisitors =========
  describe("DELETE /api/visits/all (deleteAllVisitors)", () => {
    it("should delete all visitors and return 200", async () => {
      mockDb.execute.mockResolvedValueOnce([{ affectedRows: 184 }]);

      const res = await request(app)
        .delete("/api/visits/all")
        .set("Authorization", `Bearer ${fakeToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("184");
    });

    it("should reject request without auth token", async () => {
      const res = await request(app).delete("/api/visits/all");
      expect(res.statusCode).toBe(401);
    });
  });
});
