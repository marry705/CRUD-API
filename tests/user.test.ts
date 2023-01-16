import { createServer } from 'http';
import supertest from 'supertest';
import { httpStatusCodes, RequestHeaders } from '../src/responses';
import { Request } from '../src/requests';
import { Router } from '../src/router';
import { UpdateUserArgs } from '../src/entities';
import { Store } from '../src/store';

const router = new Router();
const server = createServer(
    { IncomingMessage: Request },
    router.requestHandler
);

const testRequest = supertest(server);
const store = Store.getInstance();

afterAll(() => {
    server.close();
});

beforeEach(async () => {
    await store.clear();
});

describe('Multi-step scenarios', () => {
    it('1: getAll, create, getUser, update, getAll', async () => {
        const { status: statusGetAll, body: bodyGetAll } = await testRequest
            .get('/api/users')
            .set(RequestHeaders);

        expect(statusGetAll).toBe(httpStatusCodes.OK);
        expect(bodyGetAll).toEqual([]);

        const userData: UpdateUserArgs = {
            username: 'Marry',
            age: 25,
            hobbies: ['hobby1', 'hobby2', 'hobby3'],
        };

        const { status: statusCreate, body: bodyCreate } = await testRequest
            .post('/api/users')
            .set(RequestHeaders)
            .send(userData);

        expect(statusCreate).toBe(httpStatusCodes.CREATED);

        const { status: statusGetUser, body: bodyGetUser } = await testRequest
            .get(`/api/users/${bodyCreate.id}`)
            .set(RequestHeaders);

        expect(statusGetUser).toBe(httpStatusCodes.OK);
        expect(bodyGetUser.username).toBe(userData.username);
        expect(bodyGetUser.age).toBe(userData.age);
        expect(bodyGetUser.hobbies).toEqual(userData.hobbies);

        const updateUserData = {
            username: 'MarryNew',
            age: 27,
        };

        const { status: statusUpdatedUser, body: updatedUserBody } = await testRequest
            .put(`/api/users/${bodyGetUser.id}`)
            .set(RequestHeaders)
            .send(updateUserData);

        expect(statusUpdatedUser).toBe(httpStatusCodes.OK);
        expect(updatedUserBody.username).toBe(updateUserData.username);
        expect(updatedUserBody.age).toBe(updateUserData.age);
        expect(updatedUserBody.hobbies).toEqual(userData.hobbies);

        const { status: statusGetUsers, body: bodyGetUsers } = await testRequest
            .get('/api/users')
            .set(RequestHeaders);

        expect(statusGetUsers).toBe(httpStatusCodes.OK);
        expect(bodyGetUsers).toEqual([{
            ...updatedUserBody
        }]);
    });

    it('2: getAll, create, delete, getUser, getAll', async () => {
        const { status: statusGetAll, body: bodyGetAll } = await testRequest
            .get('/api/users')
            .set(RequestHeaders);

        expect(statusGetAll).toBe(httpStatusCodes.OK);
        expect(bodyGetAll).toEqual([]);

        const userData: UpdateUserArgs = {
            username: 'Marry',
            age: 25,
            hobbies: ['hobby1', 'hobby2', 'hobby3'],
        };

        const { status: statusCreate, body: bodyCreate } = await testRequest
            .post('/api/users')
            .set(RequestHeaders)
            .send(userData);

        expect(statusCreate).toBe(httpStatusCodes.CREATED);
        expect(bodyCreate.username).toBe(userData.username);
        expect(bodyCreate.age).toBe(userData.age);
        expect(bodyCreate.hobbies).toEqual(userData.hobbies);

        const { status: statusDeleteUser } = await testRequest
            .delete(`/api/users/${bodyCreate.id}`)
            .set(RequestHeaders);

        expect(statusDeleteUser).toBe(httpStatusCodes.NO_CONTENT);

        const { status: statusGetUser } = await testRequest
            .get(`/api/users/${bodyCreate.id}`)
            .set(RequestHeaders);

        expect(statusGetUser).toBe(httpStatusCodes.NOT_FOUND);

        const { status: statusGetUsers, body: bodyGetUsers } = await testRequest
            .get('/api/users')
            .set(RequestHeaders);

        expect(statusGetUsers).toBe(httpStatusCodes.OK);
        expect(bodyGetUsers).toEqual([]);
    });
});