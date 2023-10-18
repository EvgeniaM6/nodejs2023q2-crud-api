import http from 'http';
import { v4, validate } from 'uuid';
import { UserRequest, ResponseData, User, UsersDatabase } from '../models';
import { getRequestBody } from '../utils';
import { DbManager } from './DbManager';
import { RESPONSE_STATUS, SERVER_SIDE_ERR_RESP } from '../constants';

export class UserManager {
  private dbManager: DbManager;

  constructor(dbPath: string) {
    this.dbManager = new DbManager(dbPath);
  }

  public async getUsers(): Promise<UsersDatabase | null> {
    return await this.dbManager.getDatabase();
  }

  public async createUser(request: http.IncomingMessage): Promise<ResponseData> {
    const body: string = await getRequestBody(request);

    const dataObj: UserRequest = JSON.parse(body);
    const { username, age, hobbies } = dataObj;

    const isCorrectReq: boolean = this.checkBodyFields(username, age, hobbies);
    if (!isCorrectReq) {
      return {
        respStatusCode: RESPONSE_STATUS.InvalidField,
        respData: 'Error. Request body does not contain required fields',
      };
    }

    const id: string = await this.getNewId();
    if (!id) {
      return SERVER_SIDE_ERR_RESP;
    }

    const newUserData: User = { id, username, age, hobbies };

    const respObj: ResponseData = await this.addUserToDatabase(newUserData);
    return respObj;
  }

  private async addUserToDatabase(newUserData: User): Promise<ResponseData> {
    const users: UsersDatabase | null = await this.dbManager.getDatabase();
    if (!users) {
      return SERVER_SIDE_ERR_RESP;
    }

    users.usersArray.push(newUserData);

    return await this.dbManager.rewriteDataBase(users, newUserData, RESPONSE_STATUS.Created);
  }

  private checkBodyFields(username: string, age: number, hobbies: string[]): boolean {
    if (!username || !age || !hobbies) {
      return false;
    }

    return this.checkBodyFieldsTypes(username, age, hobbies);
  }

  private checkBodyFieldsTypes(username: unknown, age: unknown, hobbies: unknown): boolean {
    const isUsernameString: boolean = username ? typeof username === 'string' : true;
    const isAgeNumber: boolean = age ? typeof age === 'number' : true;
    const isHobbiesArr: boolean = hobbies ? Array.isArray(hobbies) : true;

    if (!isUsernameString || !isAgeNumber || !isHobbiesArr) {
      return false;
    }

    const isArrOfStrings: boolean =
      hobbies && isHobbiesArr
        ? (hobbies as unknown[]).every((hobby: unknown) => typeof hobby === 'string')
        : true;
    if (!isArrOfStrings) {
      return false;
    }

    return true;
  }

  private async getNewId(): Promise<string> {
    const users: UsersDatabase | null = await this.dbManager.getDatabase();

    if (!users) {
      return '';
    }

    const { usersArray } = users;
    let newId: string;

    do {
      newId = v4();
    } while (usersArray.some((user: User) => user.id === newId));

    return newId;
  }

  public async getUserById(id: string): Promise<ResponseData> {
    if (!validate(id)) {
      return {
        respStatusCode: RESPONSE_STATUS.InvalidField,
        respData: `User id ${id} is invalid`,
      };
    }

    const users: UsersDatabase | null = await this.dbManager.getDatabase();

    if (!users) {
      return SERVER_SIDE_ERR_RESP;
    }

    const userData: User | undefined = users.usersArray.find((user: User) => user.id === id);

    if (!userData) {
      return {
        respStatusCode: RESPONSE_STATUS.NotFound,
        respData: `Record with id ${id} doesn't exist`,
      };
    }

    return {
      respStatusCode: RESPONSE_STATUS.Ok,
      respData: JSON.stringify(userData, null, '  '),
    };
  }

  public async changeUser(id: string, request: http.IncomingMessage): Promise<ResponseData> {
    const userResp: ResponseData = await this.getUserById(id);
    if (userResp.respStatusCode !== RESPONSE_STATUS.Ok) {
      return userResp;
    }
    const body: string = await getRequestBody(request);

    const dataObj: Partial<UserRequest> = JSON.parse(body);
    const { username, age, hobbies } = dataObj;

    const isCorrectFieldsTypes: boolean = this.checkBodyFieldsTypes(username, age, hobbies);
    if (!isCorrectFieldsTypes) {
      return {
        respStatusCode: RESPONSE_STATUS.InvalidField,
        respData: 'Error. Request body fields does not have correct types',
      };
    }

    const users: UsersDatabase = Object.assign({}, this.dbManager.cachedDb);

    const idxUser: number = users.usersArray.findIndex((user: User) => user.id === id);

    const userData: User = users.usersArray[idxUser];
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
    return await this.dbManager.rewriteDataBase(users, userData, RESPONSE_STATUS.Ok);
  }

  public async deleteUser(id: string): Promise<ResponseData> {
    const userResp: ResponseData = await this.getUserById(id);
    if (userResp.respStatusCode !== RESPONSE_STATUS.Ok) {
      return userResp;
    }

    const users: UsersDatabase = Object.assign({}, this.dbManager.cachedDb);
    const idxUser: number = users.usersArray.findIndex((user: User) => user.id === id);
    const [deletedUser] = users.usersArray.splice(idxUser, 1);

    return await this.dbManager.rewriteDataBase(users, deletedUser, RESPONSE_STATUS.Deleted);
  }
}
