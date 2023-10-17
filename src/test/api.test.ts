import { UserRequest, WrongUserRequest, User } from '../models';
import { changeUser, createUser, deleteUser, getUser, getUsers, wrongFetch } from './fetch';

const wrongUser: Partial<UserRequest> = {
  username: 'Max',
  age: 18,
};
const wrongTypeUser: WrongUserRequest = {
  username: 'Max',
  age: 18,
  hobbies: [18],
};

const mockUser: UserRequest = {
  username: 'Max',
  age: 18,
  hobbies: ['dance'],
};

let createdUser: User;
const changes: Partial<UserRequest> = { age: 19 };
const mockId = '55555';
const mockUuid = '5db46112-e1db-4ce0-b7f6-5321fcc237b1';

describe('Scenario #1', () => {
  it('GET api/users should answer with status code 200 and empty array', async () => {
    const response: Response = await getUsers();
    expect(response.status).toBe(200);

    const data: User[] = await response.json();
    expect(data.length).toBe(0);
  });

  it('POST api/users should answer with status code 201 and newly created record', async () => {
    const response: Response = await createUser(mockUser);
    expect(response.status).toBe(201);

    const data: User = await response.json();
    createdUser = data;
  });

  it('GET api/users/${userId} should answer with status code 200 and created record', async () => {
    const response: Response = await getUser(createdUser.id);
    expect(response.status).toBe(200);

    const data: User = await response.json();
    expect(data).toEqual(createdUser);
  });

  it('PUT api/users/${userId} should answer with status code 200 and GET should answer with changed record', async () => {
    const response: Response = await changeUser(createdUser.id, changes);
    expect(response.status).toBe(200);

    const responseUser: Response = await getUser(createdUser.id);
    const data: User = await responseUser.json();
    expect(data.age).toBe(changes.age);
  });

  it('DELETE api/users/${userId} should answer with status code 204 and GET api/users should answer with empty array', async () => {
    const response: Response = await deleteUser(createdUser.id);
    expect(response.status).toBe(204);

    const responseAllUsers: Response = await getUsers();
    const data: User[] = await responseAllUsers.json();
    expect(data.length).toBe(0);
  });
});

describe('Scenario #2', () => {
  it('GET api/users/${userId} with invalid id should answer with status code 400', async () => {
    const response: Response = await getUser(mockId);
    expect(response.status).toBe(400);
  });

  it('GET api/users/${userId} with non-existent uuid should answer with status code 404', async () => {
    const response: Response = await getUser(mockUuid);
    expect(response.status).toBe(404);
  });

  it('PUT api/users/${userId} with invalid id should answer with status code 400', async () => {
    const responseUser: Response = await createUser(mockUser);
    const data: User = await responseUser.json();
    createdUser = data;

    const response: Response = await changeUser(mockId, changes);
    expect(response.status).toBe(400);
  });

  it('PUT api/users/${userId} with non-existent uuid should answer with status code 404', async () => {
    const response: Response = await changeUser(mockUuid, changes);
    expect(response.status).toBe(404);
  });

  it('DELETE api/users/${userId} with invalid id should answer with status code 400', async () => {
    const response: Response = await deleteUser(mockId);
    expect(response.status).toBe(400);
  });

  it('DELETE api/users/${userId} with non-existent uuid should answer with status code 404', async () => {
    const response: Response = await deleteUser(mockUuid);
    expect(response.status).toBe(404);
  });

  it('DELETE api/users/${userId} with existent uuid should answer with status code 204', async () => {
    const response: Response = await deleteUser(createdUser.id);
    expect(response.status).toBe(204);
  });
});

describe('Scenario #3', () => {
  it('requests to non-existing endpoints should answer with status code 404', async () => {
    const response: Response = await wrongFetch();
    expect(response.status).toBe(404);
  });

  it('POST api/users without required fields should answer with status code 400', async () => {
    const response: Response = await createUser(wrongUser as UserRequest);
    expect(response.status).toBe(400);
  });

  it('POST api/users with wrong field type should answer with status code 400', async () => {
    const response: Response = await createUser(wrongTypeUser);
    expect(response.status).toBe(400);
  });
});
