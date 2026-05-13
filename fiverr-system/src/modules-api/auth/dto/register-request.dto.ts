import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsOptional, IsDateString, IsIn } from 'class-validator';

export class RegisterRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @MaxLength(50, { message: 'Password must be less than 50 characters' })
    password: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsDateString()
    @IsOptional()
    birth_day?: string;

    @IsIn(['MALE', 'FEMALE', 'OTHER'])
    @IsOptional()
    gender?: string;

    @IsString({ each: true })
    @IsOptional()
    skill?: string[];

    @IsString({ each: true })
    @IsOptional()
    certification?: string[];
}
