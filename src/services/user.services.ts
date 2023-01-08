import { IUser, UpdateArgs, User } from '../entities';
import { Store } from '../store';
import { validate } from 'uuid';

export interface IUserService {
    getAll: () => IUser[],
    getById: (userId: string) => IUser,
    create: (user: IUser) => IUser,
    update: (userForUpdate: UpdateArgs) => IUser,
    delete: (userId: string) => void,
    isIdValid: (userId?: string) => boolean,
    isValidData: (username?: any, age?: any, hobbies?: any) => boolean,
};

export class UserService implements IUserService {
    private readonly store: Store;

    constructor() {
        this.store = Store.getInstance();
    };

    public isValidData (username?: any, age?: any, hobbies?: any): boolean {
        return username && typeof username === 'string' &&
            age && typeof age === 'number' &&
            hobbies && Array.isArray(hobbies);
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

    public update(userData: UpdateArgs): IUser {
        try {
            const oldUser = this.store.getByID(userData.id);

            const updatedUser = this.store.update(new User({
                id: userData.id,
                username: userData.username || oldUser.username,
                age: userData.age || oldUser.age,
                hobbies: userData.hobbies || oldUser.hobbies,
            }));

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
