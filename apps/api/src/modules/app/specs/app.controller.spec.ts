import { Test, TestingModule } from '@nestjs/testing';
import { AppsController } from '@/modules/app/app.controller';

describe('AppsController', () => {
    let controller: AppsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppsController],
        }).compile();

        controller = module.get<AppsController>(AppsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
