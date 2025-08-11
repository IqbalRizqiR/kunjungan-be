import { Test, TestingModule } from '@nestjs/testing';
import { TujuanController } from './tujuan.controller';

describe('TujuanController', () => {
  let controller: TujuanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TujuanController],
    }).compile();

    controller = module.get<TujuanController>(TujuanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
