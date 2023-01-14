import { IUser, User } from '../entities';
import { ErrorMessages } from '../responses';

export class Store {
    private static instance: Store;

    private users: IUser[];

    private constructor() {
        this.users = [];
    }

    public static getInstance(): Store {
        if (!Store.instance) { 
            Store.instance = new Store();
        }

        return Store.instance;
    }

    private setState(newState: IUser[]): void {
        this.users = [...newState];
    }
    
    public async getAll(): Promise<IUser[]> { 
        return await new Promise((resolve) => {
            resolve(this.users);
        });
    }

    public async getByID(id: string): Promise<IUser> {
        return await new Promise((resolve, reject) => {
            const userIndex = this.users.findIndex((user) => user.id === id);

            if (userIndex === -1) {
                reject(new Error(ErrorMessages.USER_NOT_FOUND));
            }

            resolve(this.users[userIndex]);
        });
    }

    public async create(user: IUser): Promise<IUser> {
        return await new Promise((resolve) => {
            this.setState([...this.users, new User(user)]);

            resolve(user);
        });
    }

    public async update(updatedUser: IUser): Promise<IUser> {
        return await new Promise(async (resolve, reject) => {
            const userIndex = this.users.findIndex((user) => user.id === updatedUser.id);

            if (userIndex === -1) {
                reject(new Error(ErrorMessages.USER_NOT_FOUND));
            }

            this.users[userIndex].update(updatedUser);

            resolve(updatedUser);
        });
    }

    public async remove(id: string): Promise<void> {
        return await new Promise((resolve, reject) => {
            const userIndex = this.users.findIndex((user) => user.id === id);

            if (userIndex === -1) {
                reject(new Error(ErrorMessages.USER_NOT_FOUND));
            }

            this.users.splice(userIndex, 1);
            
            resolve();
        });
    }
}