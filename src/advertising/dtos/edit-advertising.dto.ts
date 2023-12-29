import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditAdvertisingDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  images: { image: string; thumbnail: string }[];

  @IsOptional()
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

  @IsOptional()
  @IsNumber()
  minPrice: number;

  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @IsOptional()
  @IsString()
  location: string;

  @IsArray()
  tags: string[];

  @IsOptional()
  @IsString()
  city: string;
}
