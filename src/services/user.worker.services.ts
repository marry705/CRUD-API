import process from 'process';
import cluster from 'cluster';
import { IUserService } from './user.services';
import { IUser, UpdateArgs } from '../entities';
import { validate } from 'uuid';
import { ErrorMessages } from './response';
import { StoreActions } from '../store';

export class UserWorkerService implements IUserService {
    private async sendCommandToMasterProcess(method: StoreActions, parameters: any[] = []): Promise<any> {
        return await new Promise((resolve, reject) => {
            process.send!({ method, parameters });

            cluster.worker!.once('message', (message) => {
                
                if (message.method != method) {
                    reject(new Error(ErrorMessages.SERVER_ERROR));
                }

                if (message.error) {
                    reject(new Error(message.error));
                }

                resolve(message.data);
            });
        });
    }

    public isValidData (username?: any, age?: any, hobbies?: any): boolean {
        return typeof username === 'string' && typeof age === 'number' && Array.isArray(hobbies);
    }

    public isIdValid (userId?: string): boolean {
        return !userId ? false : validate(userId);
    }

    public async getAll(): Promise<IUser[]> {
        return await this.sendCommandToMasterProcess('getAll');
    }

    public async getById(userId: string): Promise<IUser> {
        return await this.sendCommandToMasterProcess('getByID', [userId]);
    }

    public async create(user: IUser): Promise<IUser> {
        return await this.sendCommandToMasterProcess('create', [user]);
    }

    public async update(userForUpdate: UpdateArgs): Promise<IUser> {
        return await this.sendCommandToMasterProcess('update', [userForUpdate]);
    }

    public async delete(userId: string): Promise<void> {
        await this.sendCommandToMasterProcess('remove', [userId]);
    }
}