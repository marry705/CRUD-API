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

export type CreateArgs = UpdateUserArgs & {
    readonly id?: string;
};

export type UpdateArgs = Partial<Pick<UpdateUserArgs, 'age' | 'hobbies' | 'username'>> & {
    readonly id: string;
};