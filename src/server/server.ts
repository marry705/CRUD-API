import cluster, { isMaster, isWorker } from 'cluster';
import { createServer, request, ServerResponse } from 'http';
import { cpus } from 'os';
import { Router, Request } from '../router';
import { ErrorHandler, ErrorMessages } from '../services';
import { Store, StoreActions } from '../store';

type requestListenerHandler = (req: Request, res: ServerResponse) => void;

export class Server {
    private readonly router: Router;

    private readonly cpusCount: number;

    private readonly store: Store;

    private nextPortIteration: number;

    constructor() {
        this.router = new Router();
        this.cpusCount = cpus().length;
        this.nextPortIteration = 0;
        this.store = Store.getInstance();
    }

    private getNextPort = (port: number): number => {
        if (this.nextPortIteration === this.cpusCount) {
            this.nextPortIteration = 1;
        } else {
            this.nextPortIteration += 1;
        }
    
        return port + this.nextPortIteration;
    };

    private createStoreCommunicationWithWorkers = (): void => {
        for (const id in cluster.workers) {
            cluster.workers[id]?.on('message', async (message) => {
                if (typeof this.store[(message.method as StoreActions)] === 'function') {
                    try {
                        const result = await (this.store[message.method as StoreActions] as Function)(...message.parameters);
                        cluster.workers[id]?.send({ method: message.method, data: result });
                    } catch (error) {
                        cluster.workers[id]?.send({ method: message.method, error: (error as Error).message });
                    }
                } else {
                    cluster.workers[id]?.send({});
                }
            });
        }
    };

    private balancerRequestHandler = (port: number): requestListenerHandler => {
        return (mainRequest: Request, mainResponse: ServerResponse) => {
            const nextPort = this.getNextPort(port);

            if (!mainRequest.url) {
                throw new Error(ErrorMessages.NOT_VALID_URL);
            }

            const urlPath = new URL(`http://localhost:${nextPort}${mainRequest.url}`).href;

            const requestForWorker = request(urlPath, {
                        headers: mainRequest.headers,
                        method: mainRequest.method,
                    }, (workerResponse) => {
                        mainResponse.writeHead(workerResponse.statusCode || 200, workerResponse.headers);
                        workerResponse.pipe(mainResponse);
                    }).on('error', (error) => {
                        ErrorHandler(error as Error, mainResponse);
                    });

            mainRequest.pipe(requestForWorker);
        };
    };  

    private startServer = (port = 3000, callback: requestListenerHandler, message?: string): void => {
        const app = createServer(
            { IncomingMessage: Request },
            callback
        );
        
        app.listen(
            { port }, 
            message ? () => console.log(message) : undefined
        );
    };

    public startServerWithoutWorkers = (port = 3000): void => {
        this.startServer(
            port,
            this.router.requestHandler,
            `🚀 Server ready on ${port}`
        );
    };

    public startServerWithWorkers = (port = 3000): void => {
        if (isMaster) {  
            for (let index = 0; index < this.cpusCount; index += 1) {
                cluster.fork();
            }
    
            this.createStoreCommunicationWithWorkers();

            this.startServer(
                port,
                this.balancerRequestHandler(port),
                `🚀 Server ready on ${port}`
            );
        } else if (isWorker) {
            const workerPort = port + cluster.worker.id;
            this.startServer(
                workerPort,
                this.router.requestHandler,
                `Worker ${cluster.worker.id} is now connected to http://localhost:${workerPort}`
            );
        }
    };
}