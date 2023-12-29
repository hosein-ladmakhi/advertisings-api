import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  parent?: string;

  @IsNotEmpty()
  @IsString()
  advertising?: string;
}
