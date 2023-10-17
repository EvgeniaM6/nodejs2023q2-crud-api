import http from 'http';
import { ResponseData, UsersDatabase } from '../models';
import { UserManager } from './UserManager';
import path from 'path';

export class AppController {
  private dbPath: string = path.resolve(__dirname, '../database/users.json');
  private userManager = new UserManager(this.dbPath);

  public async getResponseData(request: http.IncomingMessage): Promise<ResponseData> {
    const { url, method } = request;

    const respForWrongReq: ResponseData = {
      respStatusCode: 404,
      respData: 'Error. Wrong request',
    };

    if (!url) {
      return respForWrongReq;
    }

    const urlPartsArr: string[] = url.split('/').slice(1);
    const urlPartsAmount: number = urlPartsArr.length;

    if (urlPartsArr[0] !== 'api' || urlPartsArr[1] !== 'users' || urlPartsAmount > 3) {
      return respForWrongReq;
    }

    const isTwoUrlParts: boolean = urlPartsAmount === 2;

    if (isTwoUrlParts && method === 'GET') {
      return await this.getUsers();
    }

    if (!isTwoUrlParts && method === 'GET') {
      return await this.getUserById(urlPartsArr[2]);
    }

    if (isTwoUrlParts && method === 'POST') {
      return await this.createUser(request);
    }

    if (!isTwoUrlParts && method === 'PUT') {
      return await this.changeUser(urlPartsArr[2], request);
    }

    if (!isTwoUrlParts && method === 'DELETE') {
      return await this.deleteUser(urlPartsArr[2]);
    }

    return respForWrongReq;
  }

  private async getUsers(): Promise<ResponseData> {
    const users: UsersDatabase | null = await this.userManager.getUsers();
    if (!users) {
      return {
        respStatusCode: 500,
        respData: 'Oops! Something went wrong. Try again',
      };
    }

    return {
      respStatusCode: 200,
      respData: JSON.stringify(users.usersArray, null, '  '),
    };
  }

  private async createUser(request: http.IncomingMessage): Promise<ResponseData> {
    return await this.userManager.createUser(request);
  }

  private async getUserById(id: string): Promise<ResponseData> {
    return await this.userManager.getUserById(id);
  }

  private async changeUser(id: string, request: http.IncomingMessage): Promise<ResponseData> {
    return await this.userManager.changeUser(id, request);
  }

  private async deleteUser(id: string): Promise<ResponseData> {
    return await this.userManager.deleteUser(id);
  }
}
