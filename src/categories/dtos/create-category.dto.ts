import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  parent?: string;

  @IsOptional()
  @IsString()
  children?: string;
}
