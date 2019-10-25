import { IsString, IsNumber } from "class-validator";

class CreateCommentDto {
    @IsString()
    public content!: string;
}

export class UpdateCommentDto {
    @IsNumber()
    likes!: number;

    @IsNumber()
    dislikes!: number;

    @IsString()
    content!: string;
}

export default CreateCommentDto;
