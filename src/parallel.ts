import { availableParallelism } from 'os';
import cluster, { Worker } from 'cluster';
import http from 'http';
import { App } from './components/App';
import { HOSTNAME } from './constants';

const availParallelism: number = availableParallelism();

const port: number = Number(process.env.PORT) || 4000;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  let currentPort: number = port;

  for (let i = 1; i < availParallelism; i++) {
    cluster.fork();
  }

  const mainServer: http.Server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
      currentPort = currentPort === port + availParallelism - 1 ? port + 1 : currentPort + 1;

      const request: http.ClientRequest = http.request(
        { hostname: HOSTNAME, port: currentPort, path: req.url, method: req.method },
        (response) => {
          if (response.statusCode) {
            res.statusCode = response.statusCode;
          }
          response.pipe(res);
        }
      );

      req.pipe(request);
      console.log(`Request send to ${HOSTNAME}:${currentPort}`);
    }
  );

  mainServer.listen(port, () => {
    console.info(`Load Balancer running at http://${HOSTNAME}:${port}`);
  });

  process.on('SIGINT', () => {
    mainServer.close(() => process.exit());
  });
} else {
  const { id } = cluster.worker as Worker;
  const workerPort: number = port + id;

  const app = new App();
  app.init(workerPort);

  console.log(`Worker ${process.pid} started on port ${workerPort}`);
}
