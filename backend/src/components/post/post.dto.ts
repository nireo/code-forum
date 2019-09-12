import { IsString } from 'class-validator';

class CreatePostDto {
  @IsString()
  public title: string;

  @IsString()
  public content: string;

  @IsString()
  public byUser: string;
}

export default CreatePostDto;
