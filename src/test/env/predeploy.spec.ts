//environment variables
describe('All Enviornment Variables Exist', () => {
  test.each([
    'POSTGRES_USER_NAME',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'DB_USER',
    'PORT',
    'CHAIN_ID',
    'BASE_NETWORK_HTTP_URL',
    'BASE_NETWORK_WS_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_SECRET',
    'CLOUDINARY_API_KEY',
  ])('%s exists in enviroment', (variable) => {
    expect(process.env[variable]).not.toBeFalsy();
  });
});
