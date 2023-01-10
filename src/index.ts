import { argv, env } from 'process';
import * as dotenv from 'dotenv';
import { createApp } from './server';

dotenv.config();

const isMultiNodeMode = !!argv.find((arg) => arg.startsWith('--multi-node'));

const app = createApp();

if (isMultiNodeMode) {
    // runWithWorkers(app);
  } else {
    app.listen(
        { port: env.MAIN_PORT || 3000 }, 
        () => console.log(`🚀 Server ready in ${isMultiNodeMode ? 'multi-mode' : 'normal-mode'}`)
    );
}
