import { Transform } from "class-transformer"
import { IsEmail, IsString, MinLength } from "class-validator"

export class AuthDto {

    @IsEmail()
    email: string

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    @MinLength(3)
    type:string

}
