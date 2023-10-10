import http from 'http';
import { v4, validate } from 'uuid';
import { IUserRequest, TResponse, TUser, TUsersDatabase } from '../models';
import { getRequestBody } from '../utils';
import { DbManager } from './DbManager';

export class UserManager {
  private dbManager;
  private unsuccessResp = {
    respStatusCode: 500,
    respData: 'Oops! Something went wrong. Try again',
  };

  constructor(dbPath: string) {
    this.dbManager = new DbManager(dbPath);
  }

  public async getUsers(): Promise<TUsersDatabase | null> {
    return await this.dbManager.getDatabase();
  }

  public async createUser(request: http.IncomingMessage): Promise<TResponse> {
    const body: string = await getRequestBody(request);

    const dataObj: IUserRequest = JSON.parse(body);
    const { username, age, hobbies } = dataObj;

    const isCorrectReq = this.checkBodyFields(username, age, hobbies);
    if (!isCorrectReq) {
      return {
        respStatusCode: 400,
        respData: 'Error. Request body does not contain required fields',
      };
    }

    const id: string = await this.getNewId();
    if (!id) {
      return this.unsuccessResp;
    }

    const newUserData: TUser = { id, username, age, hobbies };

    const respObj: TResponse = await this.addUserToDatabase(newUserData);
    return respObj;
  }

  private async addUserToDatabase(newUserData: TUser): Promise<TResponse> {
    const users: TUsersDatabase | null = await this.dbManager.getDatabase();
    if (!users) {
      return this.unsuccessResp;
    }

    users.usersArray.push(newUserData);

    return await this.dbManager.rewriteDataBase(users, newUserData, 201);
  }

  private checkBodyFields(username: string, age: number, hobbies: string[]): boolean {
    if (!username || !age || !hobbies) {
      return false;
    }

    const isUsernameString: boolean = typeof username === 'string';
    const isAgeNumber: boolean = typeof age === 'number';
    const isHobbiesArr: boolean = Array.isArray(hobbies);
    if (!isUsernameString || !isAgeNumber || !isHobbiesArr) {
      return false;
    }

    const isArrOfStrings: boolean = hobbies.every((hobby) => typeof hobby === 'string');
    if (!isArrOfStrings) {
      return false;
    }

    return true;
  }

  private async getNewId(): Promise<string> {
    const users: TUsersDatabase | null = await this.dbManager.getDatabase();

    if (!users) {
      return '';
    }

    const { usersArray } = users;
    let newId: string;

    do {
      newId = v4();
    } while (usersArray.some((user) => user.id === newId));

    return newId;
  }

  public async getUserById(id: string): Promise<TResponse> {
    if (!validate(id)) {
      return {
        respStatusCode: 400,
        respData: `User id ${id} is invalid`,
      };
    }

    const users: TUsersDatabase | null = await this.dbManager.getDatabase();

    if (!users) {
      return this.unsuccessResp;
    }

    const userData: TUser | undefined = users.usersArray.find((user) => user.id === id);

    if (!userData) {
      return {
        respStatusCode: 404,
        respData: `Record with id ${id} doesn't exist`,
      };
    }

    return {
      respStatusCode: 200,
      respData: JSON.stringify(userData, null, '  '),
    };
  }

  public async changeUser(id: string, request: http.IncomingMessage): Promise<TResponse> {
    const userResp: TResponse = await this.getUserById(id);
    if (userResp.respStatusCode !== 200) {
      return userResp;
    }
    const body: string = await getRequestBody(request);

    const dataObj: Partial<IUserRequest> = JSON.parse(body);
    const { username, age, hobbies } = dataObj;

    const users: TUsersDatabase = Object.assign({}, this.dbManager.cachedDb);

    const idxUser: number = users.usersArray.findIndex((user) => user.id === id);

    const userData: TUser = users.usersArray[idxUser];
    if (username) {
      userData.username = username;
    }
    if (age) {
      userData.age = age;
    }
    if (hobbies) {
      userData.hobbies = hobbies;
    }

    users.usersArray[idxUser] = userData;
    return await this.dbManager.rewriteDataBase(users, userData, 200);
  }

  public async deleteUser(id: string): Promise<TResponse> {
    const userResp: TResponse = await this.getUserById(id);
    if (userResp.respStatusCode !== 200) {
      return userResp;
    }

    const users: TUsersDatabase = Object.assign({}, this.dbManager.cachedDb);
    const idxUser: number = users.usersArray.findIndex((user) => user.id === id);
    const [deletedUser] = users.usersArray.splice(idxUser, 1);

    return await this.dbManager.rewriteDataBase(users, deletedUser, 204);
  }
}
