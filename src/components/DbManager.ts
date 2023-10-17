import fs from 'fs';
import { writeFile } from 'fs/promises';
import { ResponseData, User, UsersDatabase } from '../models';

export class DbManager {
  public cachedDb: UsersDatabase | null = null;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  public async getDatabase(): Promise<UsersDatabase | null> {
    const allUsersPromise: Promise<UsersDatabase | null> = new Promise(
      (res: (value: UsersDatabase | null) => void): void => {
        fs.readFile(this.dbPath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
          if (err) {
            res(null);
          }

          res(JSON.parse(data.toString()));
        });
      }
    );

    const allUsers: UsersDatabase | null = await allUsersPromise;
    this.cacheDb(allUsers);
    return allUsers;
  }

  private cacheDb(allUsersPromise: UsersDatabase | null): void {
    if (!allUsersPromise) {
      return;
    }

    this.cachedDb = allUsersPromise;
  }

  public async rewriteDataBase(
    users: UsersDatabase,
    respUser: User,
    successStatusCode: number
  ): Promise<ResponseData> {
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
