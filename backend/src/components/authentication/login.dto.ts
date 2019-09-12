import { IsString } from 'class-validator';

class LogInDto {
  @IsString()
  public email: string | undefined;

  @IsString()
  public password: string | undefined;
}

export default LogInDto;
