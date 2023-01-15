import { ServerResponse } from 'http';
import { BadRequestError } from './badRequestError';
import { ServerError } from './serverError';
import { NotFoundError } from './notFoundError';

export enum httpStatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export const ErrorMessages: Record<string, string> = {
    USER_NOT_FOUND: 'There is no user with this id.',
    USER_NOT_VALID_ID: 'You are accessing a not valid user id.',
    USER_NOT_VALID_DATA: 'You are accessing a not valid user data.',
    NOT_VALID_URL: 'You are accessing a non-existent url.',
    NOT_VALID_HEADERS: 'You are accessing a non-valid headers.',
    SERVER_ERROR: 'There is a tech error.',
};

export const RequestHeaders: Record<string, string> = {
    'content-type': 'application/json',
};

export const ErrorHandler = (error: Error, res: ServerResponse): void => {
    if (error instanceof NotFoundError || error.name === 'NotFoundError') {
        res.writeHead(httpStatusCodes.NOT_FOUND, RequestHeaders);
        res.end(JSON.stringify({ message: error.message }));
        return;
    }

    if (error instanceof BadRequestError || error.name === 'BadRequestError') {
        res.writeHead(httpStatusCodes.BAD_REQUEST, RequestHeaders);
        res.end(JSON.stringify({ message: error.message }));
        return;
    }

    if (error instanceof ServerError || error.name === 'ServerError') {
        res.writeHead(httpStatusCodes.INTERNAL_SERVER_ERROR, RequestHeaders);
        res.end(JSON.stringify({ message: ErrorMessages.SERVER_ERROR }));
        return;
    }

    res.writeHead(httpStatusCodes.INTERNAL_SERVER_ERROR, RequestHeaders);
    res.end(JSON.stringify({ message: ErrorMessages.SERVER_ERROR }));
    return;
};

export const ResponseHandler = (res: ServerResponse, statusCodes: httpStatusCodes, data?: Record<string, any>): void => {
    res.writeHead(statusCodes, RequestHeaders);
    res.end(JSON.stringify(data));
};  