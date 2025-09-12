import { ContainerService } from '@/modules/container/container.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ContainerService', () => {
    let service: ContainerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ContainerService],
        }).compile();

        service = module.get<ContainerService>(ContainerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
