import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../entities';
import { IUserService, UserService } from '../services';
import { ErrorHandler, ErrorMessages, httpStatusCodes, ResponsHandler } from '../services/serverResponse';

export interface IUserController {
    getAll: (req: IncomingMessage, res: ServerResponse) => void,
    getById: (req: IncomingMessage, res: ServerResponse) => void,
    delete: (req: IncomingMessage, res: ServerResponse) => void,
    post: (req: IncomingMessage, res: ServerResponse, data: string) => void,
    put: (req: IncomingMessage, res: ServerResponse, data: string) => void,
};

export class UserController implements IUserController {
    private readonly userService: IUserService;
    
    constructor() {
        this.userService = new UserService();
    };

    public getAll(_: IncomingMessage, res: ServerResponse): void {
        try {
            const users = this.userService.getAll();

            ResponsHandler(res, httpStatusCodes.OK, users);
        } catch(error) {
            throw error;
        }
    };

    public getById(req: IncomingMessage, res: ServerResponse): void {
        try {
            const { url } = req;

            const userId: string | undefined = url?.split('/').pop();

            if (!this.userService.isIdValid(userId)) {
                throw new Error(ErrorMessages.USER_NOT_VALID_ID);
            };

            const user = this.userService.getById(userId!);

            ResponsHandler(res, httpStatusCodes.OK, user);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    };

    public delete(req: IncomingMessage, res: ServerResponse): void {
        try {
            const { url } = req;

            const userId: string | undefined = url?.split('/').pop();

            if (!this.userService.isIdValid(userId)) {
                throw new Error(ErrorMessages.USER_NOT_VALID_ID);
            };

            this.userService.delete(userId!);

            ResponsHandler(res, httpStatusCodes.OK, { message: 'User was removed.' });
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    };

    public put(req: IncomingMessage, res: ServerResponse, data: string): void {
        try {
            const { url } = req;

            const userId: string | undefined = url?.split('/').pop();

            if (!this.userService.isIdValid(userId)) {
                throw new Error(ErrorMessages.USER_NOT_VALID_ID);
            };

            if (!data.length) {
                throw new Error(ErrorMessages.USER_NOT_VALID_DATA);
            };

            const { username, age, hobbies } = JSON.parse(data!);

            const user = this.userService.update(new User({ id: userId, username, age, hobbies }));

            ResponsHandler(res, httpStatusCodes.OK, user);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    };

    public post(_: IncomingMessage, res: ServerResponse, data: string): void {
        try {
            if (!data.length) {
                throw new Error(ErrorMessages.USER_NOT_VALID_DATA);
            };

            const { username, age, hobbies } = JSON.parse(data!);

            if (!username || !age || !hobbies) {
                throw new Error(ErrorMessages.USER_NOT_VALID_DATA);
            };

            const user = this.userService.create(new User({ username, age, hobbies }));

            ResponsHandler(res, httpStatusCodes.OK, user);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    };
};