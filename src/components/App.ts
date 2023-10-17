import http from 'http';
import process from 'process';
import 'dotenv/config';
import { AppController } from './AppController';
import { ResponseData } from '../models';
import { HOSTNAME } from '../constants';

export class App {
  appController = new AppController();

  init(port: number): void {
    const server: http.Server = http.createServer(
      async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
        const resObj: ResponseData = await this.appController.getResponseData(req);
        const { respData, respStatusCode } = resObj;
        res.statusCode = respStatusCode;
        res.setHeader('Content-Type', 'text/plain');
        res.end(respData);
      }
    );

    server.listen(port, HOSTNAME, () => {
      console.log(`Server running at http://${HOSTNAME}:${port}/`);
    });

    process.on('SIGINT', () => {
      server.close(() => process.exit());
    });
  }
}
