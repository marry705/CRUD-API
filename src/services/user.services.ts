import { IUser, UpdateArgs, User } from '../entities';
import { Store } from '../store';
import { validate } from 'uuid';

export interface IUserService {
    getAll: () => Promise<IUser[]>,
    getById: (userId: string) => Promise<IUser>,
    create: (user: IUser) => Promise<IUser>,
    update: (userForUpdate: UpdateArgs) => Promise<IUser>,
    delete: (userId: string) => Promise<void>,
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

    public async getAll(): Promise<IUser[]> {
        return await this.store.getAll();
    };

    public async getById(userId: string): Promise<IUser> {
        return await this.store.getByID(userId);
    };

    public async create(newUser: IUser): Promise<IUser> {
        return await this.store.create(newUser);
    };

    public async update(userData: UpdateArgs): Promise<IUser> {
        try {
            const oldUser = await this.store.getByID(userData.id);

            return await this.store.update(new User({
                id: userData.id,
                username: userData.username || oldUser.username,
                age: userData.age || oldUser.age,
                hobbies: userData.hobbies || oldUser.hobbies,
            }));
        } catch(error) {
            throw error;
        }
    };

    public async delete(userId: string): Promise<void> {
        try {
            const user = await this.store.getByID(userId);
            
            return await this.store.remove(user);
        } catch(error) {
            throw error;
        }
    };
}
