const register = require('../controllers/authController').register;
// Import the module to be mocked
const validateUserForms = require('../validators/validateUserForms');

jest.mock('../models/UserModel', () => ({
    findOne: jest.fn(),
}));
const userModel = require('../models/UserModel');
// Mock the module
jest.mock('../validators/validateUserForms', () => {
    const originalModule = jest.requireActual('../validators/validateUserForms');
    return {
        ...originalModule,
        validateRegister: jest.fn(),
    };
});

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

});
