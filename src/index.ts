import { argv, env } from 'process';
import * as dotenv from 'dotenv';
import { Server } from './server';
import { DEFAULT_PORT } from './server';

dotenv.config();

const isMultiNodeMode = !!argv.find((arg) => arg.startsWith('--multi-node'));

const app = new Server();

if (isMultiNodeMode) {
    app.startServerWithWorkers(parseInt(env.MAIN_PORT ?? DEFAULT_PORT.toString()));
  } else {
    app.startServerWithoutWorkers(parseInt(env.MAIN_PORT ?? DEFAULT_PORT.toString()));
}
