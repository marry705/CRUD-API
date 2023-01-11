import { argv } from 'process';
import * as dotenv from 'dotenv';
import { runWithWorkers, runWithoutWorkers } from './server';

dotenv.config();

const isMultiNodeMode = !!argv.find((arg) => arg.startsWith('--multi-node'));

if (isMultiNodeMode) {
    runWithWorkers();
  } else {
    runWithoutWorkers();
}
