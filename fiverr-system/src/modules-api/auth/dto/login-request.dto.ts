import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Password must be less than 50 characters' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
