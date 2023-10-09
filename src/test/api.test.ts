const getUsers: () => Promise<Response> = () => fetch(`http://127.0.0.1:4000/api/users`);
// const getUser = (user) => fetch(`http://127.0.0.1:4000/api/users/${user}`);

describe('api', () => {
  it('should return all users', () => {
    return getUsers().then((response) => {
      console.log('response=', response);
      expect(response).toBeDefined();
    });
  });

  it('should return all users', () => {
    return getUsers().then((response) => {
      expect(response.status).toBe(200);
    });
  });
});
