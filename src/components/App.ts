import http from 'http';
import process from 'process';
import 'dotenv/config';
import { AppController } from './AppController';

export class App {
  appController = new AppController();

  init(port: number): void {
    const hostname = '127.0.0.1';

    const server = http.createServer(
      async (req: http.IncomingMessage, res: http.ServerResponse) => {
        const resObj = await this.appController.getResponseData(req);
        const { respData, respStatusCode } = resObj;
        res.statusCode = respStatusCode;
        res.setHeader('Content-Type', 'text/plain');
        res.end(respData);
      }
    );

    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });

    process.on('SIGINT', () => {
      server.close(() => process.exit());
    });
  }
}
