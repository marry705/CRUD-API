import { IUser, UpdateArgs, User } from '../entities';
import { Store } from '../store';
import { IUserService } from './types';

export class UserService implements IUserService {
    private readonly store: Store;

    constructor() {
        this.store = Store.getInstance();
    }

    public async getAll(): Promise<IUser[]> {
        return await this.store.getAll();
    }

    public async getById(userId: string): Promise<IUser> {
        return await this.store.getByID(userId);
    }

    public async create(newUser: IUser): Promise<IUser> {
        return await this.store.create(newUser);
    }

    public async update(userData: UpdateArgs): Promise<IUser> {
        const oldUser = await this.store.getByID(userData.id);

        return await this.store.update(new User({
            id: userData.id,
            username: userData.username ?? oldUser.username,
            age: userData.age ?? oldUser.age,
            hobbies: userData.hobbies ?? oldUser.hobbies,
        }));
    }

    public async delete(userId: string): Promise<void> {
        await this.store.getByID(userId);
            
        return await this.store.remove(userId);
    }
}
