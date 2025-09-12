import { ContainerController } from '@/modules/container/container.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('ContainerController', () => {
    let controller: ContainerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ContainerController],
        }).compile();

        controller = module.get<ContainerController>(ContainerController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
