import cluster, { isMaster, isWorker } from 'cluster';
import { createServer, request, ServerResponse } from 'http';
import { cpus } from 'os';
import { parse } from 'url';
import { Router, Request } from '../router';
import { ErrorMessages } from '../services';

type requestListenerHandler = (req: Request, res: ServerResponse) => void;

export class Server {
    private readonly router: Router;
    private readonly cpusCount: number;
    private nextPortIteration: number;

    constructor() {
        this.router = new Router();
        this.cpusCount = cpus().length;
        this.nextPortIteration = 0;
    };

    private getNextPort = (port: number): number => {
        if (this.nextPortIteration === this.cpusCount) {
            this.nextPortIteration = 1;
        } else {
            this.nextPortIteration += 1;
        }
    
        return port + this.nextPortIteration;
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
                }, (wResponse) => {
                    mainResponse.writeHead(wResponse.statusCode || 200, wResponse.headers);
                    wResponse.pipe(mainResponse);
                });

            mainRequest.pipe(requestForWorker);
        };
    };  

    private startServer = (port: number = 3000, callback: requestListenerHandler, message?: string): void => {
        const app = createServer(
            { IncomingMessage: Request },
            callback
        );
        
        app.listen(
            { port }, 
            message ? () => console.log(message) : undefined
        );
    };

    public startServerWithoutWorkers = (port: number = 3000): void => {
        this.startServer(
            port,
            this.router.requestHandler,
            `🚀 Server ready on ${port}`
        );
    };

    public startServerWithWorkers = (port: number = 3000): void => {
        if (isMaster) {  
            for (let index = 0; index < this.cpusCount; index += 1) {
                cluster.fork();
            }

            cluster.on('exit', (worker) => {
                console.log(`worker ${worker.id} died`);
            });
            
            cluster.on('message', (worker, message) => {
                console.log('MESSAGE', message);
            });
    
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
};