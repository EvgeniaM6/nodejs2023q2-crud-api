import http from 'http';
import { v4 } from 'uuid';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { IUserRequest, TResponse, TUser, TUsersDatabase } from '../models';
import { getRequestBody } from '../utils';

export class UserManager {
  private dbPath: string;
  private respWrongUserData = {
    respStatusCode: 400,
    respData: 'Error. Request body does not contain required fields'
  };

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  public async createUser(request: http.IncomingMessage): Promise<TResponse> {
    const body: string = await getRequestBody(request);

    const dataObj: IUserRequest = JSON.parse(body);
    const { username, age, hobbies } = dataObj;

    const isCorrectReq = this.checkBodyFields(username, age, hobbies);
    if (!isCorrectReq) {
      return this.respWrongUserData;
    }

    const id: string = v4();
    // TODO: check if uuid is already created
    const newUserData: TUser = { id, username, age, hobbies };

    const respObj: TResponse = await this.addUserToDatabase(newUserData);
    return respObj;
  }

  private async addUserToDatabase(newUserData: TUser): Promise<TResponse> {
    const users: TUsersDatabase = require(this.dbPath);
    users.usersArray.push(newUserData);

    const databasePath: string = join(__dirname, this.dbPath);
    
    try {
      await writeFile(databasePath, JSON.stringify(users, null, '  '));
      return {
        respStatusCode: 201,
        respData: JSON.stringify(newUserData, null, '  ')
      };
    } catch (error) {
      return this.respWrongUserData;
    }
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
}
