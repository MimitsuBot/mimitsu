import database from '../src/structures/Database';

(async function() {
  await database.authenticate;
})();

describe('Database', () => {
  it('should be able to connect to database', async () => {
    expect(database).toBeTruthy;
  });
});
