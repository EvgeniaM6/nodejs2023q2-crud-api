import fs from 'fs';
import { writeFile } from 'fs/promises';
import { TResponse, TUser, TUsersDatabase } from '../models';

export class DbManager {
  public cachedDb: TUsersDatabase | null = null;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  public async getDatabase(): Promise<TUsersDatabase | null> {
    const allUsersPromise: Promise<TUsersDatabase | null> = new Promise((res) => {
      fs.readFile(this.dbPath, (err, data) => {
        if (err) {
          res(null);
        }

        res(JSON.parse(data.toString()));
      });
    });

    const allUsers = await allUsersPromise;
    this.cacheDb(allUsers);
    return allUsers;
  }

  private cacheDb(allUsersPromise: TUsersDatabase | null): void {
    if (!allUsersPromise) {
      return;
    }

    this.cachedDb = allUsersPromise;
  }

  public async rewriteDataBase(
    users: TUsersDatabase,
    respUser: TUser,
    successStatusCode: number
  ): Promise<TResponse> {
    try {
      await writeFile(this.dbPath, JSON.stringify(users, null, '  '));
      return {
        respStatusCode: successStatusCode,
        respData: JSON.stringify(respUser, null, '  '),
      };
    } catch (error) {
      return {
        respStatusCode: 500,
        respData: 'Oops! Something went wrong. Try again',
      };
    }
  }
}
