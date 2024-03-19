import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let access_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'abdullah@gmail.com',
      password: 'pass123',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto.password)
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto.email)
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('should throw if no body provided', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')

          .expect(HttpStatus.BAD_REQUEST);
      });
      it('should signup', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect(HttpStatus.CREATED);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto.password)
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto.email)
          .expect(HttpStatus.BAD_REQUEST);
      });
      it('should throw if no body prodived', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')

          .expect(HttpStatus.BAD_REQUEST);
      });
      it('should signin', async () => {
        const response = await request(
          app.getHttpServer(),
        )
          .post('/auth/signin')
          .send(dto)
          .expect(HttpStatus.OK);

        access_token = response.body.access_token;
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return request(app.getHttpServer())
          .get('/users/me')
          .set(
            'Authorization',
            `Bearer ${access_token}`,
          )
          .expect(HttpStatus.OK);
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName: 'Abdull',
        email: 'abd@gm.com',
      };
      it('should edit user', () => {
        return request(app.getHttpServer())
          .patch('/users')
          .set(
            'Authorization',
            `Bearer ${access_token}`,
          )
          .send(dto)
          .expect(HttpStatus.OK)
          .expect((response) => {
            expect(response.body).toHaveProperty(
              'firstName',
              dto.firstName,
            );
            expect(response.body).toHaveProperty(
              'email',
              dto.email,
            );
          });
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create Bookmarks', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit Bookmark', () => {});

    describe('Delete user', () => {});
  });
});
