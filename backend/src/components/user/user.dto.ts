import { IsString } from 'class-validator';

class CreateUserDto {
  @IsString()
  public username: string | undefined;

  @IsString()
  public email: string | undefined;

  @IsString()
  public password: string | undefined;
}

export default CreateUserDto;
