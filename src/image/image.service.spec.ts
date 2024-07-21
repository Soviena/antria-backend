import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { join } from 'path';

describe('ImageService', () => {
  let imageService: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageService],
    }).compile();

    imageService = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(imageService).toBeDefined();
  });

  describe('getImage', () => {
    it('should return the correct file path', () => {
      const filename = 'test-image.jpg';
      const expectedPath = join(process.cwd(), 'MediaUpload', filename);

      expect(imageService.getImage(filename)).toBe(expectedPath);
    });
  });
});
