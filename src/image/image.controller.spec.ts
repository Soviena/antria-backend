import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';
import { AuthGuard, OwnerOnly } from 'src/auth/auth.guards';


describe('ImageController', () => {
  let imageController: ImageController;
  let imageService: ImageService;

  const filename = 'test-image.jpg';
  const filePath = path.resolve(__dirname, 'test-image.jpg'); // Path to the mock file

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        {
          provide: ImageService,
          useValue: {
            getImage: jest.fn().mockReturnValue(filePath),
          },
        },
      ],
    }).compile();

    imageController = module.get<ImageController>(ImageController);
    imageService = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(imageController).toBeDefined();
  });

  describe('getImage', () => {
    it('should return a StreamableFile if file exists', async () => {
      // Mock fs.promises.access to simulate file existence
      jest.spyOn(fs.promises, 'access').mockResolvedValueOnce(undefined);

      // Mock createReadStream to avoid actual file system interaction
      jest.spyOn(fs, 'createReadStream').mockReturnValueOnce({
        pipe: jest.fn().mockReturnThis(), // Mock stream methods if needed
      } as any);

      const result = await imageController.getImage(filename);
      expect(result).toBeInstanceOf(StreamableFile);
    });

    it('should handle file not found gracefully', async () => {
      // Mock fs.promises.access to simulate file not found
      jest.spyOn(fs.promises, 'access').mockRejectedValueOnce(new Error('File not found'));

      const result = await imageController.getImage(filename);
      expect(result).toBeUndefined(); // Or handle error as appropriate
    });
  });
});
