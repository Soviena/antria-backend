
import { join } from 'path';

export class ImageService {

  getImage(filename: string): string {
    return join(process.cwd(), 'MediaUpload', filename);
  }
}