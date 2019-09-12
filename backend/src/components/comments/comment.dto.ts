import { IsString } from 'class-validator';

class CreateCommentDto {
  @IsString()
  public content: string | undefined;
}

export default CreateCommentDto;
