import { IUser } from '../entities';
import { ErrorMessages } from '../services';

export class Store {
    private static instance: Store;

    private users: IUser[] = [];

    private constructor() {
        this.users = [];
    };

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }

        return Store.instance;
    };

    private setState(newState: IUser[]): void {
        this.users = [...newState];
    };
    
    public async getAll(): Promise<IUser[]> { 
        return await new Promise((resolve) => {
            resolve(this.users);
        });
    };

    public async getByID (id: string): Promise<IUser> {
        return await new Promise((resolve) => {
            const userIndex = this.users.findIndex((user) => user.id === id);

            if (userIndex === -1) {
                throw new Error(ErrorMessages.USER_NOT_FOUND);
            }

            resolve(this.users[userIndex]);
        });
    };

    public async create (user: IUser): Promise<IUser> {
        return await new Promise((resolve) => {
            this.setState([...this.users, user]);

            resolve(user);
        });
    };

    public async update (updatedUser: IUser): Promise<IUser> {
        return await new Promise((resolve) => {
            const newState = this.users.map((user) => {
                if (user.id === updatedUser.id) {
                  user.update(updatedUser);
                }
    
                return user;
            });
    
            this.setState(newState);

            resolve(updatedUser);
        });
    };

    public async remove (removedUser: IUser): Promise<void> {
        return await new Promise((resolve) => {
            const newState = this.users.filter((user) => user.id !== removedUser.id);

            this.setState(newState);
            
            resolve();
        });
    };
};
