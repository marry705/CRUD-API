import { ServerResponse } from 'http';
import { User, UpdateUserArgs } from '../entities';
import { ErrorMessages, httpStatusCodes, ResponseHandler, BadRequestError } from '../responses';
import { IUserService, Service } from '../services';
import { Request } from '../requests';
import { IUserController } from './types';
import { UserValidation, IValidation } from '../validation';

export class UserController implements IUserController {
    private readonly service: IUserService;

    private readonly validation: IValidation;
    
    constructor() {
        this.service = Service.getInstance();
        this.validation = new UserValidation();
    }

    public async getAll(_: Request, res: ServerResponse): Promise<void> {
        const users = await this.service.getAll();

        ResponseHandler(res, httpStatusCodes.OK, users);
    }

    public async getById(req: Request, res: ServerResponse): Promise<void> {
        const { url } = req;

        const userId: string | undefined = url?.split('/')[3];

        if (!this.validation.isIdValid(userId)) {
            throw new BadRequestError(ErrorMessages.USER_NOT_VALID_ID);
        }

        const user = await this.service.getById(userId!);

        ResponseHandler(res, httpStatusCodes.OK, user);
    }

    public async delete(req: Request, res: ServerResponse): Promise<void> {
        const { url } = req;

        const userId: string | undefined = url?.split('/')[3];

        if (!this.validation.isIdValid(userId)) {
            throw new BadRequestError(ErrorMessages.USER_NOT_VALID_ID);
        }

        await this.service.delete(userId!);

        ResponseHandler(res, httpStatusCodes.NO_CONTENT);
    }

    public async put(req: Request, res: ServerResponse): Promise<void> {
        const { url } = req;

        const userId: string | undefined = url?.split('/')[3];

        if (!this.validation.isIdValid(userId)) {
            throw new BadRequestError(ErrorMessages.USER_NOT_VALID_ID);
        }

        const { username, age, hobbies } = req.getJsonBody() as UpdateUserArgs;

        if (username && !this.validation.isValidUserName(username)) {
            throw new BadRequestError(ErrorMessages.USER_NOT_VALID_DATA);
        }

        if (age && !this.validation.isValidAge(age)) {
            throw new BadRequestError(ErrorMessages.USER_NOT_VALID_DATA);
        }

        if (hobbies && !this.validation.isValidHobbies(hobbies)) {
            throw new BadRequestError(ErrorMessages.USER_NOT_VALID_DATA);
        }

        const user = await this.service.update({ id: userId!, username, age, hobbies });

        ResponseHandler(res, httpStatusCodes.OK, user);
    }

    public async post(req: Request, res: ServerResponse): Promise<void> {
        const { username, age, hobbies } = req.getJsonBody() as UpdateUserArgs;

        if (!this.validation.isValidData(username, age, hobbies)) {
            throw new BadRequestError(ErrorMessages.USER_NOT_VALID_DATA);
        }

        const user = await this.service.create(new User({ username, age, hobbies }));

        ResponseHandler(res, httpStatusCodes.CREATED, user);
    }
}