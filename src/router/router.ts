import { IncomingMessage, ServerResponse } from 'http';
import { IUserController, UserController } from '../controller';
import { ErrorHandler, ErrorMessages, RequsetHeaders } from '../services';

export class Router {
    private readonly userController: IUserController;
    private readonly userIDReg = /^\/api\/users\/[a-z0-9\-]+\/?$/;
    private readonly baseUrlReg = /^\/api\/users\/?$/;
    
    constructor() {
        this.userController = new UserController();
    };

    public requestHandler = (req: IncomingMessage, res: ServerResponse, body: string): void => {
        try {
            const { url, method, headers } = req;
            
            if (!url?.match(this.baseUrlReg) && !url?.match(this.userIDReg)) {
                throw new Error(ErrorMessages.NOT_VALID_URL);
            };

            if (!(headers['content-type'] === RequsetHeaders['content-Type'])) {
                throw new Error(ErrorMessages.NOT_VALID_HEADERS);
            };

            switch(method) {
                case 'GET': {
                    if (url?.match(this.userIDReg)) {
                        this.userController.getById(req, res);
                    } else {
                        this.userController.getAll(req, res);
                    }
                    break;
                }
                case 'PUT': {
                    this.userController.put(req, res, body);
                    break;
                }
                case 'POST': {
                    this.userController.post(req, res, body);
                    break;
                }
                case 'DELETE': {
                    this.userController.delete(req, res);
                    break;
                }
                default: {
                    throw new Error(ErrorMessages.NOT_VALID_URL);
                }
            }
        } catch (error) {
            ErrorHandler(error as Error, res);
        }
    };

    public requestListener = (req: IncomingMessage, res: ServerResponse): void => {
        let body: string = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            this.requestHandler(req, res, body);
        });
    };
};