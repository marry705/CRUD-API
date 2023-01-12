import { v4 } from 'uuid';

export interface IUser {
    readonly id: string,
    readonly username: string,
    readonly age: number,
    readonly hobbies: string[],
    update: (args: UpdateUserArgs) => void,
}

export type UpdateUserArgs = {
    readonly username: string; 
    readonly age: number; 
    readonly hobbies: string[];
};

type CreateArgs = UpdateUserArgs & {
    readonly id?: string;
};

export type UpdateArgs = Partial<Pick<UpdateUserArgs, 'age' | 'hobbies' | 'username'>> & {
    readonly id: string;
};

export class User implements IUser{
    id: string;

    username: string;

    age: number;

    hobbies: string[];

    constructor (args: CreateArgs) {
        const { id = v4(), username, age, hobbies } = args;
        this.id = id;
        this.username = username;
        this.age = age;
        this.hobbies = [...hobbies];
    }

    update ({ username, age, hobbies }: UpdateUserArgs): void {
        this.username = username;
        this.age = age;
        this.hobbies = [...hobbies];
    }
}