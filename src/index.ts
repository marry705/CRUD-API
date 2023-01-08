import { env } from 'process';
import * as dotenv from 'dotenv';
import { createServer } from 'http';
import { Router } from './router';

dotenv.config();

const router = new Router();

createServer(router.requestListener).listen(
    { port: env.MAIN_PORT || 3000 }, 
    () => console.log('🚀 Server ready')
);