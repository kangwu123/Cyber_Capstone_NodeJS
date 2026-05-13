import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, MaxLength, MinLength, IsNumber, IsPhoneNumber, IsOptional, IsDateString, IsEnum, Matches, IsDate, IsArray } from 'class-validator';

export class UserRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Name must be less than 50 characters' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Password must be less than 50 characters' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === "") return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  })
  @IsDate()
  @ApiProperty({ example: '11-11-1999', description: 'Your birth day' })
  birth_day?: Date;


  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  @ApiProperty({ example: 'MALE | FEMALE | OTHER', description: 'Your gender' })
  gender: string;

  @IsNotEmpty()
  @IsEnum(['ADMIN', 'USER'])
  @ApiProperty({ example: 'ADMIN | USER ', description: 'Your role' })
  role: string;


  @ApiProperty({ example: ['javascript', 'typescript'], description: 'Danh sách kỹ năng' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Kiểm tra từng phần tử trong mảng phải là string
  skill: string[];

  @ApiProperty({ example: ['AWS Certified'], description: 'Danh sách chứng chỉ' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certification: string[];
}

