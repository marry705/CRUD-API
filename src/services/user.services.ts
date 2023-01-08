import { IUser } from '../entities';
import { Store } from '../store';
import { validate } from 'uuid';

export interface IUserService {
    getAll: () => IUser[],
    getById: (userId: string) => IUser,
    create: (user: IUser) => IUser,
    update: (userForUpdate: IUser) => IUser,
    delete: (userId: string) => void,
    isIdValid: (userId?: string) => boolean,
};

export class UserService implements IUserService {
    private readonly store: Store;

    constructor() {
        this.store = Store.getInstance();
    };

    public isIdValid (userId?: string): boolean {
        return !userId ? false : validate(userId);
    };

    public getAll(): IUser[] {
        try {
            const users = this.store.getAll();

            return users;
        } catch(error) {
            throw error;
        }
    };

    public getById(userId: string): IUser {
        try {
            const user = this.store.getByID(userId);

            return user;
        } catch(error) {
            throw error;
        }
    };

    public create(newUser: IUser): IUser {
        try {
            const user = this.store.create(newUser);

            return user;
        } catch(error) {
            throw error;
        }
    };

    public update(userForUpdate: IUser): IUser {
        try {
            this.store.getByID(userForUpdate.id);
            const updatedUser = this.store.update(userForUpdate);

            return updatedUser;
        } catch(error) {
            throw error;
        }
    };

    public delete(userId: string): void {
        try {
            const user = this.store.getByID(userId);
            this.store.remove(user);

        } catch(error) {
            throw error;
        }
    };
}
