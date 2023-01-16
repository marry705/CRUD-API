import { validate } from 'uuid';
import { IValidation } from './types';

export class UserValidation implements IValidation {

    public isValidUserName(username?: unknown): boolean {
        return (typeof username === 'string');
    }

    public isValidAge(age?: unknown): boolean {
        return (typeof age === 'number');
    }

    public isValidHobbies(hobbies?: unknown): boolean {
        return Array.isArray(hobbies) && (hobbies.every((hobby: unknown) => typeof hobby === 'string'));
    }

    public isValidData(username?: unknown, age?: unknown, hobbies?: unknown): boolean {
        return this.isValidUserName(username)
            && this.isValidAge(age)
            && this.isValidHobbies(hobbies);
    }

    public isIdValid(userId?: string): boolean {
        return !userId ? false : validate(userId);
    }
}