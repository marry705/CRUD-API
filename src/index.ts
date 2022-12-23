import { env } from 'process';
import * as dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config();

const requestListener = (_, res): void => {
    res.writeHead(200);
    res.end(`My first server!`);
};

const server = createServer(requestListener);

server.listen({ port: env.PORT || 3000 }, () => console.log(`🚀 Server ready`));