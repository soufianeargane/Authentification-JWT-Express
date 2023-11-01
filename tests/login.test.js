const loginTest = require("../controllers/authController").login;
const validateForms = require("../validators/validateUserForms").validateForms;
const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("Test loginTest function", () => {
    it("should return 400 if email is not provided", async () => {
        // define req and res
        const req = {
            body: {
                password: "123456",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(validateForms, "validateLogin").mockReturnValue({
            error: { details: [{ message: '"email" is required' }] },
        });

        // call the function
        await loginTest(req, res);

        // check if res.status is called with 400
        expect(res.status).toHaveBeenCalledWith(400);
        // check if res.json is called with { error: 'Email is required' }
        expect(res.json).toHaveBeenCalledWith({ error: '"email" is required' });
    });
    it("should return 400 if password is not provided", async () => {
        // define req and res
        const req = {
            body: {
                email: "test@test.com",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.spyOn(validateForms, "validateLogin").mockReturnValue({
            error: { details: [{ message: '"password" is required' }] },
        });
    });
    it("should return 400 if user is not found in the database", async () => {
        // define req and res
        const req = {
            body: {
                email: "test@test.com",
                password: "123456",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.spyOn(validateForms, "validateLogin").mockReturnValue({
            error: null,
        });
        // mock findOne with populate to return null
        UserModel.findOne = jest
            .fn()
            .mockReturnValue({ populate: jest.fn().mockReturnValue(null) });

        // call the function
        await loginTest(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Email is not found" });
    });
    it("should return 400 if password is invalid", async () => {
        // define req and res
        const req = {
            body: {
                email: "test@gmail.com",
                password: "123456",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(validateForms, "validateLogin").mockReturnValue({
            error: null,
        });
        // mock findOne with populate to return object user
        UserModel.findOne = jest
            .fn()
            .mockReturnValue({ populate: jest.fn().mockReturnValue({}) });
        // mock compare to return false
        bcryptjs.compare = jest.fn().mockReturnValue(false);

        // call the function
        await loginTest(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid password" });
    });
    it("should return 400 if user is not verified", async () => {
        const req = {
            body: {
                email: "test@gmail.com",
                password: "123456",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(validateForms, "validateLogin").mockReturnValue({
            error: null,
        });
        // mock findOne with populate to return object user
        UserModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                is_verified: false,
            }),
        });
        // mock compare to return false
        bcryptjs.compare = jest.fn().mockReturnValue(true);

        // call the function
        await loginTest(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: "Please verify your email",
        });
    });
    it("should call res.redirect with /api/user/manager/me if user role is manager", async () => {
        const req = {
            body: {
                email: "test@gmail.com",
                password: "123456",
            },
            // mock cookie
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            redirect: jest.fn(),
        };

        jest.spyOn(validateForms, "validateLogin").mockReturnValue({
            error: null,
        });
        // mock findOne with populate to return object user
        UserModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                is_verified: true,
                role: {
                    name: "manager",
                },
            }),
        });
        // mock compare to return false
        bcryptjs.compare = jest.fn().mockReturnValue(true);

        // mock sign to return token
        jwt.sign = jest.fn().mockReturnValue("token");

        // call the function
        await loginTest(req, res);

        // expect(res.redirect).toHaveBeenCalledWith("/api/user/manager/me");

        // expect this: res.json({ success: "Logged in successfully", user: returnUser });
        expect(res.json).toHaveBeenCalledWith({
            success: "Logged in successfully",
            user: {
                _id: undefined,
                name: undefined,
                email: undefined,
                role: "manager",
            },
        });
    });
});
