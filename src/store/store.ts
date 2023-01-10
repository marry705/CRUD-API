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
    
    public getAll(): IUser[] { 
        return this.users;
    };

    public getByID (id: string): IUser {
        const userIndex = this.users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            throw new Error(ErrorMessages.USER_NOT_FOUND);
        }

        return this.users[userIndex];
    };

    public create (user: IUser): IUser {
        this.setState([...this.users, user]);

        return user;
    };

    public update (updatedUser: IUser): IUser {
        const newState = this.users.map((user) => {
            if (user.id === updatedUser.id) {
              user.update(updatedUser);
            }

            return user;
        });

        this.setState(newState);

        return updatedUser;
    };

    public remove (removedUser: IUser): void {
        const newState = this.users.filter((user) => user.id !== removedUser.id);

        this.setState(newState);
    };
};
