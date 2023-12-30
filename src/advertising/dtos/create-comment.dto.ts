import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  parent?: string;

  @IsNotEmpty()
  @IsString()
  advertising?: string;
}
