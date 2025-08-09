import { Test, TestingModule } from '@nestjs/testing';
import { VisitSettingsController } from './visit-settings.controller';

describe('VisitSettingsController', () => {
  let controller: VisitSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitSettingsController],
    }).compile();

    controller = module.get<VisitSettingsController>(VisitSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
