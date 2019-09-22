import { IsString } from "class-validator";

export class CreateReviewDto {
  @IsString()
  toComment!: string;

  @IsString()
  content!: string;

  @IsString()
  title!:string;
}