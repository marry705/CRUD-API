import { IUser, UpdateArgs } from '../entities';

export interface IUserService {
    getAll: () => Promise<IUser[]>,
    getById: (userId: string) => Promise<IUser>,
    create: (user: IUser) => Promise<IUser>,
    update: (userForUpdate: UpdateArgs) => Promise<IUser>,
    delete: (userId: string) => Promise<void>,
    isIdValid: (userId?: string) => boolean,
    isValidData: (username?: any, age?: any, hobbies?: any) => boolean,
}

export type WorkerParam = string | IUser | UpdateArgs;