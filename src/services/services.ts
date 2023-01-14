import { isWorker } from 'cluster';
import { IUserService } from './types';
import { UserService } from './user.services';
import { UserWorkerService } from './user.worker.services';

export class Service {
    private static instance: IUserService;

    public static getInstance(): IUserService {
        if (!Service.instance) { 
            Service.instance = isWorker ? new UserWorkerService() : new UserService();
        }

        return Service.instance;
    }
}