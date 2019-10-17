import { IsString } from "class-validator";

export class CreateReport {
  @IsString()
  public content: string | undefined;
}
