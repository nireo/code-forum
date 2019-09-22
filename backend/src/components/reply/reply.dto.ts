import { IsString } from "class-validator";

export class CreateReplyDto {
  @IsString()
  toComment!: string;

  @IsString()
  content!: string;

  @IsString()
  title!:string;
}