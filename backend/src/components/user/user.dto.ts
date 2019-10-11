import { IsString } from "class-validator";

class CreateUserDto {
  @IsString()
  public username: string | undefined;

  @IsString()
  public email: string | undefined;

  @IsString()
  public password: string | undefined;
}

export class UpdatePassword {
  @IsString()
  public password: string | undefined;
}

export class UpdateUsername {
  @IsString()
  public username: string | undefined;
}

export class UpdateEmail {
  @IsString()
  public email: string | undefined;
}

export default CreateUserDto;
