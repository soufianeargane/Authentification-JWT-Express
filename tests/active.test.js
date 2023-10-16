const active = require('../controllers/authController').activate;
const validateToken = require('../validators/validateToken');

jest.mock('../validators/validateToken');

describe('Test activate function', () => {
    it('should return 401 if token is not provided', async () => {
        // define req and res
        const req = {
            params: {}

        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        // call the function
        await active(req, res);

        // check if res.status is called with 401
        expect(res.status).toHaveBeenCalledWith(401);
        // check if res.json is called with { error: 'Access denied' }
        expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
    });

    it('should return 401 if token is invalid', async () => {

        // Mock validateToken to return an invalid token
        validateToken.mockReturnValue({ error: 'Token is invalid' });

        const req = {
            params: {
                token: 'invalid token'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await active(req, res);

        // Check if res.status is called with 401
        expect(res.status).toHaveBeenCalledWith(401);
        // Check if res.json is called with { error: 'Access denied' }
        expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });

    });




});