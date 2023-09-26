import http from 'http';
import { TResponse } from '../models';

export class AppController {
  dbPath = '../database/users.json';

  async getResponseData(request: http.IncomingMessage): Promise<TResponse> {
    const { url, method } = request;

    const respForWrongReq = {
      respStatusCode: 404,
      respData: 'Error. Wrong request'
    };

    if (!url) {
      return respForWrongReq;
    }

    const urlPartsArr = url.split('/').slice(1);
    const urlPartsAmount = urlPartsArr.length;

    if (urlPartsArr[0] !== 'api' || urlPartsArr[1] !== 'users' || urlPartsAmount > 3) {
      return respForWrongReq;
    }

    const isTwoUrlParts = urlPartsAmount === 2;

    if (isTwoUrlParts && method === 'GET') {
      return this.getUsers();
    }

    return respForWrongReq;
  }

  getUsers(): TResponse {
    const users = require(this.dbPath);

    return {
      respStatusCode: 200,
      respData: JSON.stringify(users.usersArray, null, '  ')
    };
  }
}
