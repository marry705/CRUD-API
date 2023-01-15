import { createServer } from 'http';
import { v4 } from 'uuid';
import supertest from 'supertest';
import { ErrorMessages, httpStatusCodes, RequestHeaders } from '../src/responses';
import { Request } from '../src/requests';
import { Router } from '../src/router';
import { IUser, UpdateUserArgs } from '../src/entities';
import { Store } from '../src/store';

const router = new Router();
const testRequest = supertest(createServer(
    { IncomingMessage: Request },
    router.requestHandler
));
const store = Store.getInstance();

beforeEach(() => {
    store.clear();
});

describe('GET/users', () => {
    it('should return empty array and 200 code', async () => {
        const { status, body } = await testRequest.get('/api/users').set(RequestHeaders);
    
        expect(status).toBe(httpStatusCodes.OK);
        expect(body).toEqual([]);
    });

    it('should return an error on no user', async () => {
        const userId = v4();
    
        const { status, body } = await testRequest.get(`/api/users/${userId}`).set(RequestHeaders);
    
        expect(status).toBe(httpStatusCodes.NOT_FOUND);
        expect(body).toEqual({
            message: ErrorMessages.USER_NOT_FOUND,
        });
    });

    it('should return an error on no valid id', async () => {
        const userId = '543454';
    
        const { status, body } = await testRequest.get(`/api/users/${userId}`).set(RequestHeaders);
    
        expect(status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(body).toEqual({
            message: ErrorMessages.USER_NOT_VALID_ID,
        });
    });
});

describe('POST/users', () => {
    it('creates user in store should return created user', async () => {
        const createUserRequest: UpdateUserArgs = {
            username: 'Marry',
            age: 25,
            hobbies: ['hobby1', 'hobby2', 'hobby3'],
        };

        const { status, body } = await testRequest.post('/api/users')
            .set(RequestHeaders)
            .send(createUserRequest);

        const newUser = await store.getByID(body.id);

        expect(status).toEqual(httpStatusCodes.CREATED);
        expect(newUser).toBeTruthy();
    });

    it('creates user in store with not valid data should return bad request', async () => {
        const createUserRequest = {
            username: 'Marry',
            age: '25',
        };

        const { status, body } = await testRequest.post('/api/users')
            .set(RequestHeaders)
            .send(createUserRequest);

        expect(status).toBe(httpStatusCodes.BAD_REQUEST);
        expect(body).toEqual({
            message: ErrorMessages.USER_NOT_VALID_DATA,
        });
    });
});

describe('PUT/users', () => {
    it('updates user in store should return updated user', async () => {
        const userRequest: UpdateUserArgs = {
            username: 'Marry',
            age: 25,
            hobbies: ['hobby1', 'hobby2', 'hobby3'],
        };

        const { body: oldUser } = await testRequest.post('/api/users')
            .set(RequestHeaders)
            .send(userRequest);

        const updatedUserRequest = {
            username: 'Marry Name',
            age: 26,
        };

        const { status, body } = await testRequest.put(`/api/users/${oldUser.id}`)
            .set(RequestHeaders)
            .send(updatedUserRequest);
        
        expect(status).toEqual(httpStatusCodes.OK);
        expect(body.id).toEqual(oldUser.id);
        expect(body.username).toEqual(updatedUserRequest.username);
    });

    it('updates no existed user in store should return no valid id error', async () => {
        const userId = v4();

        const updatedUserRequest = {
            username: 'Marry Name',
            age: 26,
        };

        const { status, body } = await testRequest.put(`/api/users/${userId}`)
            .set(RequestHeaders)
            .send(updatedUserRequest);
        
        expect(status).toEqual(httpStatusCodes.NOT_FOUND);
        expect(body).toEqual({
            message: ErrorMessages.USER_NOT_FOUND,
        });
    });
});
