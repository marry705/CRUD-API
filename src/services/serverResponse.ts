import { ServerResponse } from 'http';

export enum httpStatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
};

export const ErrorMessages = {
    USER_NOT_FOUND: 'There is no user with this id.',
    USER_NOT_VALID_ID: 'You are accessing a not valid user id.',
    USER_NOT_VALID_DATA: 'You are accessing a not valid user data.',
    NOT_VALID_URL: 'You are accessing a non-existent url.',
    NOT_VALID_HEADERS: 'You are accessing a non-valid headers.',
    SERVER_ERROR: 'There is a tech error.',
};

export const RequsetHeaders = {
    'content-Type': 'application/json',
};

export const ErrorHandler = (error: Error, res: ServerResponse): void => {
    if (error.message === ErrorMessages.NOT_VALID_URL) {
        res.writeHead(httpStatusCodes.NOT_FOUND, RequsetHeaders);
        res.end(JSON.stringify({ message: error.message }));
    } else if (error.message === ErrorMessages.USER_NOT_FOUND) {
        res.writeHead(httpStatusCodes.NOT_FOUND, RequsetHeaders);
        res.end(JSON.stringify({ message: error.message }));
    } else if (error.message === ErrorMessages.USER_NOT_VALID_ID) {
        res.writeHead(httpStatusCodes.BAD_REQUEST, RequsetHeaders);
        res.end(JSON.stringify({ message: error.message }));
    } else if (error.message === ErrorMessages.USER_NOT_VALID_DATA) {
        res.writeHead(httpStatusCodes.BAD_REQUEST, RequsetHeaders);
        res.end(JSON.stringify({ message: error.message }));
    } else if (error.message === ErrorMessages.NOT_VALID_HEADERS) {
        res.writeHead(httpStatusCodes.BAD_REQUEST, RequsetHeaders);
        res.end(JSON.stringify({ message: error.message }));
    } else {
        res.writeHead(httpStatusCodes.INTERNAL_SERVER_ERROR, RequsetHeaders);
        res.end(JSON.stringify({ message: ErrorMessages.SERVER_ERROR }));
    }
};

export const ResponsHandler = (res: ServerResponse, statusCodes: httpStatusCodes, data: Object): void => {
    res.writeHead(statusCodes, RequsetHeaders);
    res.end(JSON.stringify(data));
};