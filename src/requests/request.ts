import { IncomingMessage } from 'http';
import { ErrorMessages, BadRequestError } from '../responses';

export class Request extends IncomingMessage {
    private body: string | undefined;

    public getBody(): string | undefined {
        return this.body;
    }

    public setBody(body: string | undefined): void {
        this.body = body;
    }

    public getJsonBody(): Object {
        if (!this.body?.length) {
            throw new BadRequestError(ErrorMessages.USER_NOT_VALID_DATA);
        }
        
        return JSON.parse(this.body);
    }
}