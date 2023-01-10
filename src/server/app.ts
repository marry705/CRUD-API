import { createServer } from 'http';
import { Router, Request } from '../router';

const router = new Router();

export const createApp = () => createServer({ IncomingMessage: Request }, router.requestHandler);