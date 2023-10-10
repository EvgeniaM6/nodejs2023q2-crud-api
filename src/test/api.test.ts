import { IUserRequest, IWrongUserRequest, TUser } from '../models';
import { changeUser, createUser, deleteUser, getUser, getUsers, wrongFetch } from './fetch';

const wrongUser: Partial<IUserRequest> = {
  username: 'Max',
  age: 18,
};
const wrongTypeUser: IWrongUserRequest = {
  username: 'Max',
  age: 18,
  hobbies: [18],
};

const mockUser: IUserRequest = {
  username: 'Max',
  age: 18,
  hobbies: ['dance'],
};

let createdUser: TUser;
const changes: Partial<IUserRequest> = { age: 19 };
const mockId = '55555';
const mockUuid = '5db46112-e1db-4ce0-b7f6-5321fcc237b1';

describe('Scenario #1', () => {
  it('GET api/users should answer with status code 200 and empty array', async () => {
    const response = await getUsers();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.length).toBe(0);
  });

  it('POST api/users should answer with status code 201 and newly created record', async () => {
    const response = await createUser(mockUser);
    expect(response.status).toBe(201);

    const data = await response.json();
    createdUser = data;
  });

  it('GET api/users/${userId} should answer with status code 200 and created record', async () => {
    const response = await getUser(createdUser.id);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual(createdUser);
  });

  it('PUT api/users/${userId} should answer with status code 200 and GET should answer with changed record', async () => {
    const response = await changeUser(createdUser.id, changes);
    expect(response.status).toBe(200);

    const responseUser = await getUser(createdUser.id);
    const data = await responseUser.json();
    expect(data.age).toBe(changes.age);
  });

  it('DELETE api/users/${userId} should answer with status code 204 and GET api/users should answer with empty array', async () => {
    const response = await deleteUser(createdUser.id);
    expect(response.status).toBe(204);

    const responseAllUsers = await getUsers();
    const data = await responseAllUsers.json();
    expect(data.length).toBe(0);
  });
});

describe('Scenario #2', () => {
  it('GET api/users/${userId} with invalid id should answer with status code 400', async () => {
    const response = await getUser(mockId);
    expect(response.status).toBe(400);
  });

  it('GET api/users/${userId} with non-existent uuid should answer with status code 404', async () => {
    const response = await getUser(mockUuid);
    expect(response.status).toBe(404);
  });

  it('PUT api/users/${userId} with invalid id should answer with status code 400', async () => {
    const responseUser = await createUser(mockUser);
    const data = await responseUser.json();
    createdUser = data;

    const response = await changeUser(mockId, changes);
    expect(response.status).toBe(400);
  });

  it('PUT api/users/${userId} with non-existent uuid should answer with status code 404', async () => {
    const response = await changeUser(mockUuid, changes);
    expect(response.status).toBe(404);
  });

  it('DELETE api/users/${userId} with invalid id should answer with status code 400', async () => {
    const response = await deleteUser(mockId);
    expect(response.status).toBe(400);
  });

  it('DELETE api/users/${userId} with non-existent uuid should answer with status code 404', async () => {
    const response = await deleteUser(mockUuid);
    expect(response.status).toBe(404);
  });

  it('DELETE api/users/${userId} with existent uuid should answer with status code 204', async () => {
    const response = await deleteUser(createdUser.id);
    expect(response.status).toBe(204);
  });
});

describe('Scenario #3', () => {
  it('requests to non-existing endpoints should answer with status code 404', async () => {
    const response = await wrongFetch();
    expect(response.status).toBe(404);
  });

  it('POST api/users without required fields should answer with status code 400', async () => {
    const response = await createUser(wrongUser as IUserRequest);
    expect(response.status).toBe(400);
  });

  it('POST api/users with wrong field type should answer with status code 400', async () => {
    const response = await createUser(wrongTypeUser);
    expect(response.status).toBe(400);
  });
});
