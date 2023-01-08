import { v4 } from 'uuid';

export interface IUser {
    readonly id: string,
    readonly username: string,
    readonly age: number,
    readonly hobbies: string[],
    update: (args: UpdateArgs) => void,
}

export type UpdateArgs = {
    readonly username: string; 
    readonly age: number; 
    readonly hobbies: string[];
};

type CreateArgs = UpdateArgs & {
    readonly id?: string;
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
    };

    update ({ username, age, hobbies }: UpdateArgs): void {
        this.username = username;
        this.age = age;
        this.hobbies = [...hobbies];
    };
}