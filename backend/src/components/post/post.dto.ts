import { IsString, IsNumber } from "class-validator";

class CreatePostDto {
  @IsString()
  public title!: string;

  @IsString()
  public content!: string;
}

export class UpdatePostDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsNumber()
  likes!: number;

  @IsNumber()
  dislikes!: number;
}

export default CreatePostDto;
