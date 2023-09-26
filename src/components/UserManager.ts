import http from 'http';
import { v4 } from 'uuid';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { IUserRequest, TResponse } from '../models';

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
    const promise: Promise<TResponse> = new Promise((res) => {
      request.on('data', async (data) => this.addUserToDatabase(data, res))
    });

    const obj = await promise;
    return obj;
  }

  private async addUserToDatabase(
    data: string,
    resolveCb: (value: TResponse | PromiseLike<TResponse>) => void
  ) {
    const dataObj: IUserRequest = JSON.parse(data);
    const { username, age, hobbies } = dataObj;

    if (!username || !age || !hobbies) {
      resolveCb(this.respWrongUserData);
      return;
    }

    const isUsernameString = typeof username === 'string';
    const isAgeNumber = typeof age === 'number';
    const isHobbiesArr = Array.isArray(hobbies);
    if (!isUsernameString || !isAgeNumber || !isHobbiesArr) {
      resolveCb(this.respWrongUserData);
      return;
    }

    const isArrOfStrings = hobbies.every((hobby) => typeof hobby === 'string');
    if (!isArrOfStrings) {
      resolveCb(this.respWrongUserData);
      return;
    }

    const id = v4();
    // TODO: check if uuid is already created
    const newUserData = { id, username, age, hobbies };

    const users = require(this.dbPath);
    users.usersArray.push(newUserData);

    const databasePath = join(__dirname, this.dbPath);
    
    try {
      await writeFile(databasePath, JSON.stringify(users, null, '  '));
      resolveCb({
        respStatusCode: 201,
        respData: JSON.stringify(newUserData, null, '  ')
      });
    } catch (error) {
      resolveCb(this.respWrongUserData);
    }
  }
}
