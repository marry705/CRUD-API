import { ServerResponse } from 'http';
import { Request } from '../requests';

export interface IUserController {
    getAll: (req: Request, res: ServerResponse) => Promise<void>,
    getById: (req: Request, res: ServerResponse) => Promise<void>,
    delete: (req: Request, res: ServerResponse) => Promise<void>,
    post: (req: Request, res: ServerResponse) => Promise<void>,
    put: (req: Request, res: ServerResponse) => Promise<void>,
}