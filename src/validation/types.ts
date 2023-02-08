export interface IValidation {
    isIdValid: (userId?: string) => boolean,
    isValidData: (username?: unknown, age?: unknown, hobbies?: unknown) => boolean,
    isValidUserName: (username?: unknown) => boolean,
    isValidAge: (age?: unknown) => boolean,
    isValidHobbies: (hobbies?: unknown) => boolean,
}