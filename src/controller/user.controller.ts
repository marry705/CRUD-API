import { ServerResponse } from 'http';
import { User, UpdateUserArgs } from '../entities';
import { ErrorHandler, ErrorMessages, httpStatusCodes, ResponseHandler, BadRequestError } from '../responses';
import { IUserService, Service } from '../services';
import { Request } from '../requests';
import { IUserController } from './types';

export class UserController implements IUserController {
    private readonly service: IUserService;
    
    constructor() {
        this.service = Service.getInstance();
    }

    public async getAll(_: Request, res: ServerResponse): Promise<void> {
        try {
            const users = await this.service.getAll();

            ResponseHandler(res, httpStatusCodes.OK, users);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    }

    public async getById(req: Request, res: ServerResponse): Promise<void> {
        try {
            const { url } = req;

            const userId: string | undefined = url?.split('/')[3];

            if (!this.service.isIdValid(userId)) {
                throw new BadRequestError(ErrorMessages.USER_NOT_VALID_ID);
            }

            const user = await this.service.getById(userId!);

            ResponseHandler(res, httpStatusCodes.OK, user);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    }

    public async delete(req: Request, res: ServerResponse): Promise<void> {
        try {
            const { url } = req;

            const userId: string | undefined = url?.split('/')[3];

            if (!this.service.isIdValid(userId)) {
                throw new BadRequestError(ErrorMessages.USER_NOT_VALID_ID);
            }

            await this.service.delete(userId!);

            ResponseHandler(res, httpStatusCodes.NO_CONTENT, { 'message': 'User was removed.' });
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    }

    public async put(req: Request, res: ServerResponse): Promise<void> {
        try {
            const { url } = req;

            const userId: string | undefined = url?.split('/')[3];

            if (!this.service.isIdValid(userId)) {
                throw new BadRequestError(ErrorMessages.USER_NOT_VALID_ID);
            }

            const { username, age, hobbies } = req.getJsonBody() as UpdateUserArgs;

            const user = await this.service.update({ id: userId!, username, age, hobbies });

            ResponseHandler(res, httpStatusCodes.OK, user);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    }

    public async post(req: Request, res: ServerResponse): Promise<void> {
        try {
            const { username, age, hobbies } = req.getJsonBody() as UpdateUserArgs;

            if (!this.service.isValidData(username, age, hobbies)) {
                throw new BadRequestError(ErrorMessages.USER_NOT_VALID_DATA);
            }

            const user = await this.service.create(new User({ username, age, hobbies }));

            ResponseHandler(res, httpStatusCodes.CREATED, user);
        } catch(error) {
            ErrorHandler(error as Error, res);
        }
    }
}