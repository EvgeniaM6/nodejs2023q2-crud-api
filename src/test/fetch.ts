import { UserRequest, WrongUserRequest } from '../models';

const getUsers = (): Promise<Response> => fetch(`http://127.0.0.1:4000/api/users`);
const createUser = (userData: UserRequest | WrongUserRequest): Promise<Response> => {
  return fetch(`http://127.0.0.1:4000/api/users`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};
const getUser = (userId: string): Promise<Response> =>
  fetch(`http://127.0.0.1:4000/api/users/${userId}`);
const changeUser = (userId: string, userData: Partial<UserRequest>): Promise<Response> => {
  return fetch(`http://127.0.0.1:4000/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};
const deleteUser = (userId: string): Promise<Response> => {
  return fetch(`http://127.0.0.1:4000/api/users/${userId}`, {
    method: 'DELETE',
  });
};
const wrongFetch = (): Promise<Response> => fetch(`http://127.0.0.1:4000/api/ggg`);

export { getUsers, createUser, getUser, changeUser, deleteUser, wrongFetch };
