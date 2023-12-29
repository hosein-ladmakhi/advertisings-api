import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateAdvertisingDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  images: { image: string; thumbnail: string }[];

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsBoolean()
  isVisible: boolean;

  @IsBoolean()
  isCommentable: boolean;

  @IsBoolean()
  isLikeable: boolean;

  @IsBoolean()
  isViewable: boolean;

  @IsNotEmpty()
  @IsNumber()
  minPrice: number;

  @IsNotEmpty()
  @IsNumber()
  maxPrice: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsArray()
  tags: string[];

  @IsNotEmpty()
  @IsString()
  city: string;
}
