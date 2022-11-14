//environment variables
import * as dotenv from 'dotenv';

describe('All Environment Variables Exist', () => {
  dotenv.config();
  test.each([
    'POSTGRES_PASSWORD',
    'POSTGRES_DB',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'DB_USER',
    'CHAIN_ID',
    'BASE_NETWORK_HTTP_URL',
    'BASE_NETWORK_WS_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_SECRET',
    'CLOUDINARY_API_KEY'
  ])('%s exists in environment', (variable) => {
    expect(process.env[variable]).not.toBeFalsy();
  });
});
