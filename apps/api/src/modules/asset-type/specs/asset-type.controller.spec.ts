import { Test, TestingModule } from '@nestjs/testing';
import { AssetTypesController } from '@/modules/asset-type/asset-type.controller';

describe('AssetTypesController', () => {
    let controller: AssetTypesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AssetTypesController],
        }).compile();

        controller = module.get<AssetTypesController>(AssetTypesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
