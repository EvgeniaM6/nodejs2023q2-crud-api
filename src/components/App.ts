import http from 'http';
import process from 'node:process';
import 'dotenv/config';
import { AppController } from './AppController';

export class App {
  appController = new AppController();

  init(): void {
    const hostname = '127.0.0.1';
    const port = Number(process.env.PORT) || 4000;

    const server = http.createServer(async (req, res) => {
      const resObj = await this.appController.getResponseData(req);
      const { respData, respStatusCode } = resObj;
      res.statusCode = respStatusCode;
      res.setHeader('Content-Type', 'text/plain');
      res.end(respData);
    });
    
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });

    process.on('SIGINT', () => {
      server.close(() => process.exit());
    });

  }
}