import { createServer } from 'http';
import { v4 } from 'uuid';
import supertest from 'supertest';
import { ErrorMessages, httpStatusCodes, RequestHeaders } from '../src/responses';
import { Request } from '../src/requests';
import { Router } from '../src/router';
import { UpdateUserArgs } from '../src/entities';
import { Store } from '../src/store';

const router = new Router();
const testRequest = supertest(createServer(
    { IncomingMessage: Request },
    router.requestHandler
));
const store = Store.getInstance();

beforeEach(async () => {
    await store.clear();
});

describe('Server testing', () => {
    it('request to non-existing endpoint should return 404 code', async () => {
        const { status, body } = await testRequest
            .get('/invalid')
            .set(RequestHeaders);
    
        expect(status).toBe(httpStatusCodes.NOT_FOUND);
        expect(body).toEqual({
            message: ErrorMessages.NOT_VALID_URL
        });
    });
});

describe('GET/users', () => {
    it('should return empty array and 200 code', async () => {
        const { status, body } = await testRequest
            .get('/api/users')
            .set(RequestHeaders);
    
        expect(status).toBe(httpStatusCodes.OK);
        expect(body).toEqual([]);
    });

    it('should return an error on no user', async () => {
        const userId = v4();
    
        const { status, body } = await testRequest
            .get(`/api/users/${userId}`)
            .set(RequestHeaders);
    
        expect(status).toBe(httpStatusCodes.NOT_FOUND);
        expect(body).toEqual({
            message: ErrorMessages.USER_NOT_FOUND,
        });
    });

    it('should return an error on no valid id', async () => {
        const userId = '543454';
    
        const { status, body } = await testRequest
            .get(`/api/users/${userId}`)
            .set(RequestHeaders);
    
        expect(status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(body).toEqual({
            message: ErrorMessages.USER_NOT_VALID_ID,
        });
    });

    it('should return user and 200 code', async () => {
        const userData: UpdateUserArgs = {
            username: 'Marry',
            age: 25,
            hobbies: ['hobby1', 'hobby2', 'hobby3'],
        };

        const { status: statusUpdateUser, body: user } = await testRequest
            .post('/api/users')
            .set(RequestHeaders)
            .send(userData);
        
        expect(statusUpdateUser).toEqual(httpStatusCodes.CREATED);

        const { status, body } = await testRequest
            .get(`/api/users/${user.id}`)
            .set(RequestHeaders);

        expect(status).toEqual(httpStatusCodes.OK);
        expect(body.id).toEqual(user.id);
        expect(body.username).toEqual(userData.username);
        expect(body.age).toEqual(userData.age);
        expect(body.hobbies).toEqual(userData.hobbies);
    });
});

describe('POST/users', () => {
    it('creates user in store should return created user', async () => {
        const userData: UpdateUserArgs = {
            username: 'Marry',
            age: 25,
            hobbies: ['hobby1', 'hobby2', 'hobby3'],
        };

        const { status, body } = await testRequest
            .post('/api/users')
            .set(RequestHeaders)
            .send(userData);

        const createdUser = await store.getByID(body.id);

        expect(status).toEqual(httpStatusCodes.CREATED);
        expect(createdUser).toBeTruthy();
    });

    it('creates user in store with not valid data should return bad request', async () => {
        const userData = {
            username: 'Marry',
            age: '25',
        };

        const { status, body } = await testRequest
            .post('/api/users')
            .set(RequestHeaders)
            .send(userData);

        expect(status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(body).toEqual({
            message: ErrorMessages.USER_NOT_VALID_DATA,
        });
    });
});

describe('PUT/users', () => {
    it('updates user in store should return updated user', async () => {
        const userData: UpdateUserArgs = {
            username: 'Marry',
            age: 25,
            hobbies: ['hobby1', 'hobby2', 'hobby3'],
        };

        const { body: user } = await testRequest
            .post('/api/users')
            .set(RequestHeaders)
            .send(userData);

        const newUserData = {
            username: 'Marry Name',
            age: 26,
        };

        const { status, body } = await testRequest
            .put(`/api/users/${user.id}`)
            .set(RequestHeaders)
            .send(newUserData);
        
        expect(status).toEqual(httpStatusCodes.OK);
        expect(body.id).toEqual(user.id);
        expect(body.username).toEqual(newUserData.username);
        expect(body.age).toEqual(newUserData.age);
        expect(body.hobbies).toEqual(user.hobbies);
    });

    it('updates no existed user in store should return no valid id error', async () => {
        const userId = v4();

        const userData = {
            username: 'Marry Name',
            age: 26,
        };

        const { status, body } = await testRequest
            .put(`/api/users/${userId}`)
            .set(RequestHeaders)
            .send(userData);
        
        expect(status).toEqual(httpStatusCodes.NOT_FOUND);
        expect(body).toEqual({
            message: ErrorMessages.USER_NOT_FOUND,
        });
    });
});

describe('DELETE/users', () => {
    it('deletes user in store should return 204 code', async () => {
        const userData: UpdateUserArgs = {
            username: 'Marry',
            age: 25,
            hobbies: ['hobby1', 'hobby2', 'hobby3'],
        };

        const { body: user } = await testRequest
            .post('/api/users')
            .set(RequestHeaders)
            .send(userData);

        const { status } = await testRequest
            .delete(`/api/users/${user.id}`)
            .set(RequestHeaders);
        
        expect(status).toEqual(httpStatusCodes.NO_CONTENT);
    });

    it('deletes no existed user in store should return 404 code', async () => {
        const userId = v4();

        const { status, body } = await testRequest
            .delete(`/api/users/${userId}`)
            .set(RequestHeaders)
        
        expect(status).toEqual(httpStatusCodes.NOT_FOUND);
        expect(body).toEqual({
            message: ErrorMessages.USER_NOT_FOUND,
        });
    });
});