import http from 'http';
import { TResponse } from '../models';
import { UserManager } from './UserManager';

export class AppController {
  private dbPath = '../database/users.json';
  private userManager = new UserManager(this.dbPath);

  public async getResponseData(request: http.IncomingMessage): Promise<TResponse> {
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

    if (!isTwoUrlParts && method === 'GET') {
      return this.getUserById(urlPartsArr[2]);
    }

    if (isTwoUrlParts && method === 'POST') {
      return await this.createUser(request);
    }

    if (!isTwoUrlParts && method === 'PUT') {
      return await this.changeUser(urlPartsArr[2], request);
    }

    return respForWrongReq;
  }

  private getUsers(): TResponse {
    const users = require(this.dbPath);

    return {
      respStatusCode: 200,
      respData: JSON.stringify(users.usersArray, null, '  ')
    };
  }

  private async createUser(request: http.IncomingMessage): Promise<TResponse> {
    return await this.userManager.createUser(request);
  }
  
  private getUserById(id: string): TResponse {
    return this.userManager.getUserById(id);
  }

  private async changeUser(id: string, request: http.IncomingMessage): Promise<TResponse> {
    return await this.userManager.changeUser(id, request);
  }
}
