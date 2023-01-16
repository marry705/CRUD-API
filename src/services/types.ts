import { IUser, UpdateArgs } from '../entities';

export interface IUserService {
    getAll: () => Promise<IUser[]>,
    getById: (userId: string) => Promise<IUser>,
    create: (user: IUser) => Promise<IUser>,
    update: (userForUpdate: UpdateArgs) => Promise<IUser>,
    delete: (userId: string) => Promise<void>,
}

export type WorkerParam = string | IUser | UpdateArgs;