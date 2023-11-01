const active = require("../controllers/authController").activate;
const validateToken = require("../validators/validateToken");
const UserModel = require("../models/UserModel");

jest.mock("../validators/validateToken");

describe("Test activate function", () => {
    it("should return 401 if token is not provided", async () => {
        // define req and res
        const req = {
            params: {},
            body: {
                token: "",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // call the function
        await active(req, res);

        // check if res.status is called with 401
        expect(res.status).toHaveBeenCalledWith(401);
        // check if res.json is called with { error: 'Access denied' }
        expect(res.json).toHaveBeenCalledWith({ error: "Access denied" });
    });

    it("should return 401 if token is invalid", async () => {
        // Mock validateToken to return an invalid token
        validateToken.mockReturnValue({ error: "Token is invalid" });

        const req = {
            params: {
                token: "invalid token",
            },

            body: {
                token: "invalid token",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await active(req, res);

        // Check if res.status is called with 401
        expect(res.status).toHaveBeenCalledWith(401);
        // Check if res.json is called with { error: 'Access denied' }
        expect(res.json).toHaveBeenCalledWith({
            error: "Access denied, token unvalid",
        });
    });

    it("should return 200 if token is valid", async () => {
        validateToken.mockReturnValue({
            success: "Token is valid",
            data: {
                _id: "652d4f9a79e246509057fbd0",
            },
        });
        UserModel.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });
        const req = {
            params: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic291ZmlhbmUiLCJlbWFpbCI6ImFub3ZpY3Nvc29AZ21haWwuY29tIiwiaXNfdmVyaWZpZWQiOmZhbHNlLCJyb2xlIjoiNjUyYWUzNDNjM2I3NTE1N2I0OGVkN2IzIiwiX2lkIjoiNjUyZDRmOWE3OWUyNDY1MDkwNTdmYmQwIiwiZGF0ZSI6IjIwMjMtMTAtMTZUMTQ6NTg6MzQuNTg5WiIsIl9fdiI6MCwiaWF0IjoxNjk3NDY4MzE0LCJleHAiOjE2OTc0Njg5MTR9.JiTOhI1X6YDRAhPFDUGCRIzXmg5rMuZv-8YZdEiV6fk", // Provide a valid token
            },
            body: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic291ZmlhbmUiLCJlbWFpbCI6ImFub3ZpY3Nvc29AZ21haWwuY29tIiwiaXNfdmVyaWZpZWQiOmZhbHNlLCJyb2xlIjoiNjUyYWUzNDNjM2I3NTE1N2I0OGVkN2IzIiwiX2lkIjoiNjUyZDRmOWE3OWUyNDY1MDkwNTdmYmQwIiwiZGF0ZSI6IjIwMjMtMTAtMTZUMTQ6NTg6MzQuNTg5WiIsIl9fdiI6MCwiaWF0IjoxNjk3NDY4MzE0LCJleHAiOjE2OTc0Njg5MTR9.JiTOhI1X6YDRAhPFDUGCRIzXmg5rMuZv-8YZdEiV6fk", // Provide a valid token
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await active(req, res);

        // Check if res.json is called with the success message
        expect(res.json).toHaveBeenCalledWith({
            success: "Account activated successfully, now go to log in",
        });
    });
});
