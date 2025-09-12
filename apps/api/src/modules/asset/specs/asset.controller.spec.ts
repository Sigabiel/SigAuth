import { AssetController } from '@/modules/asset/asset.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('AssetController', () => {
    let controller: AssetController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AssetController],
        }).compile();

        controller = module.get<AssetController>(AssetController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
