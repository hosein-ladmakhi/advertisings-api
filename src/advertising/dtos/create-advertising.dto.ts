import { File } from 'src/upload/dtos/file.dto';

export class CreateAdvertisingDTO {
  title: string;
  content: string;
  images: { image: string; thumbnail: string }[];
  category: string;
  isVisible: boolean;
  isCommentable: boolean;
  isLikeable: boolean;
  isViewable: boolean;
  minPrice: number;
  maxPrice: number;
  location: string;
  tags: string[];
}
