import { createServer } from 'http';
import { env } from 'process';
import { Router, Request } from '../router';

const router = new Router();

const createApp = () => createServer(
    { IncomingMessage: Request },
    router.requestHandler
);

export const runWithoutWorkers = () => {
    const app = createApp();

    const PORT = env.MAIN_PORT || 3000;
    
    app.listen(
        { port: PORT }, 
        () => console.log(`🚀 Server ready on ${PORT}`)
    );
}

export const runWithWorkers = () => {
    const app = createApp();

    const PORT = env.MAIN_PORT || 3000;
    
    app.listen(
        { port: PORT }, 
        () => console.log(`🚀 Server ready on ${PORT}`)
    );
}