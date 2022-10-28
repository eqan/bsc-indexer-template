import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  //env
  describe('Enviornment Variables', () => {
    it('should test all environment variables exist', () => {
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
        expect(process.env[variable]).toBeDefined();
      });
    });
  });
});
