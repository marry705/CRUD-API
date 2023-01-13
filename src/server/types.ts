import { ServerResponse } from 'http';
import { Request } from '../requests';

export type RequestListenerHandler = (req: Request, res: ServerResponse) => void;