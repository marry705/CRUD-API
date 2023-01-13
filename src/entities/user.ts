import { v4 } from 'uuid';
import { CreateArgs, IUser, UpdateUserArgs } from './types';

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