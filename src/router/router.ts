import { ServerResponse } from 'http';
import { IUserController, UserController } from '../controller';
import { Request } from '../requests';
import {
    ErrorHandler,
    ErrorMessages,
    RequestHeaders,
    BadRequestError,
    NotFoundError
} from '../responses';

export class Router {
    private readonly userController: IUserController;

    private readonly userIDReg = /^\/api\/users\/[a-z0-9\-]+\/?$/;

    private readonly baseUrlReg = /^\/api\/users\/?$/;
    
    constructor() {
        this.userController = new UserController();
    }

    private resolveBody = async (req: Request): Promise<string> => {
        const bodyChunks: Uint8Array[] = [];
    
        for await (const chunk of req) {
            bodyChunks.push(chunk);
        }
    
        return Buffer.concat(bodyChunks).toString();
    };

    public requestHandler = async (req: Request, res: ServerResponse): Promise<void> => {
        try {
            const rawBody = await this.resolveBody(req);
            req.setBody(rawBody);

            const { url, method, headers } = req;
            
            if (!url?.match(this.baseUrlReg) && !url?.match(this.userIDReg)) {
                throw new NotFoundError(ErrorMessages.NOT_VALID_URL);
            }

            if (!(headers['content-type'] === RequestHeaders['content-type'])) {
                throw new BadRequestError(ErrorMessages.NOT_VALID_HEADERS);
            }

            switch(method) {
                case 'GET': {
                    if (url?.match(this.userIDReg)) {
                        await this.userController.getById(req, res);
                    } else {
                        await this.userController.getAll(req, res);
                    }
                    break;
                }
                case 'PUT': {
                    await this.userController.put(req, res);
                    break;
                }
                case 'POST': {
                    await this.userController.post(req, res);
                    break;
                }
                case 'DELETE': {
                    await this.userController.delete(req, res);
                    break;
                }
                default: {
                    throw new NotFoundError(ErrorMessages.NOT_VALID_URL);
                }
            }
        } catch (error) {
            ErrorHandler(error as Error, res);
        }
    };
}