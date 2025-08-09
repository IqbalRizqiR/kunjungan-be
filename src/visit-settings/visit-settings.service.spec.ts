import { Test, TestingModule } from '@nestjs/testing';
import { VisitSettingsService } from './visit-settings.service';

describe('VisitSettingsService', () => {
  let service: VisitSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitSettingsService],
    }).compile();

    service = module.get<VisitSettingsService>(VisitSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
