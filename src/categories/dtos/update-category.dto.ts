import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  parent?: string;

  @IsOptional()
  @IsString()
  children?: string;
}
