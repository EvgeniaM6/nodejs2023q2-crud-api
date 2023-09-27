export interface IUserRequest {
  username: string;
  age: number;
  hobbies: string[];
}

export interface TUser extends IUserRequest {
  id: string;
}

export type TUsersDatabase = {
  usersArray: TUser[];
}
