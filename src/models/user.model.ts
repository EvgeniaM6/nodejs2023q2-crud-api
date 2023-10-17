export interface UserRequest {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends UserRequest {
  id: string;
}

export type UsersDatabase = {
  usersArray: User[];
};

export interface WrongUserRequest extends Omit<UserRequest, 'hobbies'> {
  hobbies: number[];
}
