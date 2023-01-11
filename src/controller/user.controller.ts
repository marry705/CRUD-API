import { ServerResponse } from 'http';
import { User } from '../entities';
import { UpdateUserArgs } from '../entities/user';
import { Request } from '../router';
import {
    IUserService,
    UserService,
    ErrorHandler,
    ErrorMessages,
    httpStatusCodes,
    ResponseHandler
} from '../services';

export interface IUserController {
    getAll: (req: Request, res: ServerResponse) => Promise<void>,
    getById: (req: Request, res: ServerResponse) => Promise<void>,
    delete: (req: Request, res: ServerResponse) => Promise<void>,
    post: (req: Request, res: ServerResponse) => Promise<void>,
    put: (req: Request, res: ServerResponse) => Promise<void>,
};

export class UserController implements IUserController {
    private readonly userService: IUserService;
    
    constructor() {
        this.userService = new UserService();
    };

    public async getAll(_: Request, res: ServerResponse): Promise<void> {
        try {
            const users = await this.userService.getAll();

            ResponseHandler(res, httpStatusCodes.OK, users);
        } catch(error) {
            throw error;
        }
    };

    public async getById(req: Request, res: ServerResponse): Promise<void> {
        try {
            const { url } = req;

            const userId: string | undefined = url?.split('/')[3];

            if (!this.userService.isIdValid(userId)) {
                throw new Error(ErrorMessages.USER_NOT_VALID_ID);
            };

            const user = await this.userService.getById(userId!);

            ResponseHandler(res, httpStatusCodes.OK, user);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    };

    public async delete(req: Request, res: ServerResponse): Promise<void> {
        try {
            const { url } = req;

            const userId: string | undefined = url?.split('/')[3];

            if (!this.userService.isIdValid(userId)) {
                throw new Error(ErrorMessages.USER_NOT_VALID_ID);
            };

            await this.userService.delete(userId!);

            ResponseHandler(res, httpStatusCodes.OK, { message: 'User was removed.' });
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    };

    public async put(req: Request, res: ServerResponse): Promise<void> {
        try {
            const { url } = req;

            const userId: string | undefined = url?.split('/')[3];

            if (!this.userService.isIdValid(userId)) {
                throw new Error(ErrorMessages.USER_NOT_VALID_ID);
            };

            const { username, age, hobbies } = req.getJsonBody() as UpdateUserArgs;

            if (!this.userService.isValidData(username, age, hobbies)) {
                throw new Error(ErrorMessages.USER_NOT_VALID_DATA);
            };

            const user = await this.userService.update({ id: userId!, username, age, hobbies });

            ResponseHandler(res, httpStatusCodes.OK, user);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    };

    public async post(req: Request, res: ServerResponse): Promise<void> {
        try {
            const { username, age, hobbies } = req.getJsonBody() as UpdateUserArgs;

            if (!this.userService.isValidData(username, age, hobbies)) {
                throw new Error(ErrorMessages.USER_NOT_VALID_DATA);
            };

            const user = await this.userService.create(new User({ username, age, hobbies }));

            ResponseHandler(res, httpStatusCodes.OK, user);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    };
};