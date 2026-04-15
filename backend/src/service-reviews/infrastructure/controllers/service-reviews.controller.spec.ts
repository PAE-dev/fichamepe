import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CreateServiceReviewUseCase } from '../../application/use-cases/create-service-review.use-case';
import { GetMyServiceReviewUseCase } from '../../application/use-cases/get-my-service-review.use-case';
import { ListServiceReviewsUseCase } from '../../application/use-cases/list-service-reviews.use-case';
import { ServiceReviewsController } from './service-reviews.controller';

describe('ServiceReviewsController', () => {
  let app: INestApplication;
  const listExecute = jest.fn();
  const createExecute = jest.fn();
  const mineExecute = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [ServiceReviewsController],
      providers: [
        {
          provide: ListServiceReviewsUseCase,
          useValue: { execute: listExecute },
        },
        {
          provide: CreateServiceReviewUseCase,
          useValue: { execute: createExecute },
        },
        {
          provide: GetMyServiceReviewUseCase,
          useValue: { execute: mineExecute },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /services/:serviceId/reviews llama al caso de uso con paginación', async () => {
    listExecute.mockResolvedValue({
      items: [],
      total: 0,
      verifiedInPage: 0,
    });
    const serviceId = 'c1000001-0001-0001-0001-000000000001';
    await request(app.getHttpServer())
      .get(`/services/${serviceId}/reviews`)
      .query({ limit: 10, offset: 5 })
      .expect(200);

    expect(listExecute).toHaveBeenCalledWith(serviceId, 10, 5);
  });

  it('GET /services/:serviceId/reviews rechaza límite fuera de rango', async () => {
    const serviceId = 'c1000001-0001-0001-0001-000000000001';
    await request(app.getHttpServer())
      .get(`/services/${serviceId}/reviews`)
      .query({ limit: 99 })
      .expect(400);
    expect(listExecute).not.toHaveBeenCalled();
  });
});
