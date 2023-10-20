const register = require('../controllers/authController').register;

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../helpers/sendMail');

const userModel = require('../models/UserModel');

jest.mock('../models/UserModel', () => ({
    findOne: jest.fn(),
    save: jest.fn(),
}));
// Replace the original UserModel with the mock


// Mock the module of user forms validation
jest.mock('../validators/validateUserForms', () => {
    const originalModule = jest.requireActual('../validators/validateUserForms');
    return {
        ...originalModule,
        validateRegister: jest.fn(),
    };
});
// Mock the module sending emails
jest.mock('../helpers/sendMail', () => jest.fn());

// Now you can access validateRegister as a mocked function
const validateRegister = require('../validators/validateUserForms').validateRegister;

// Your test can remain the same
describe('register', () => {

    it('should return a status 400 and json with error if the req.body is not valid', () => {
        const req = {
            body: {
                name: '',
                email: 'azertynyoz@gmail.com',
                password: 'azerty',
                role: 'user',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the behavior of validateRegister
        validateRegister.mockReturnValue({
            error: 'error',
            details: [
                {
                    message: 'name is not allowed to be empty',
                },
            ],
        });

        register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: '\"name\" is not allowed to be empty' });
    });
    it('should return a status 400 and json with error if the email already exists', async () => {
        const req = {
            body: {
                name: 'azerty',
                email: 'anovicsoso@gmail.com',
                password: 'azerty',
                role: 'user',
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        validateRegister.mockReturnValue({
            error: ''
        });

        // Mock userModel.findOne to simulate that the email already exists
        userModel.findOne.mockReturnValue({
            _id: 'some-unique-id',
            name: 'Test User',
            email: 'anovicsoso@gmail.com', // Mock an existing email
            password: 'testpassword',
        });

        await register(req, res);

        // The status should be 400, as the email already exists
        expect(res.status).toHaveBeenCalledWith(400);
        // The JSON response should match what you return in the code
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });
    // it ('should return a status 201 and json with success if the user is created', async () => {
    //     const req = {
    //         body: {
    //             name: 'azerty',
    //             email: 'anovicsoso@gmail.com',
    //             password: 'azerty',
    //             role: 'user',
    //         }
    //     }
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //     }
    //     validateRegister.mockReturnValue({
    //         error: ''
    //     });
    //     jest.spyOn(userModel, 'findOne').mockReturnValue(null);
    //     jest.spyOn(bcryptjs, 'genSalt').mockResolvedValue('mockedSalt'); // Corrected
    //     jest.spyOn(bcryptjs, 'hash').mockResolvedValue('mockedHashedPassword'); // Corrected
    //     jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken');
    //     sendMail.mockResolvedValue('mockedSendMail');
    //
    //     await register(req, res);
    //
    //     expect(res.status).toHaveBeenCalledWith(201);
    //     expect(res.json).toHaveBeenCalledWith({ success: 'User registered successfully, verify your email' });
    //
    // });

});
