import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @ApiProperty({ example: 'Thiết kế Website chuyên nghiệp' })
  @IsNotEmpty()
  @IsString()
  job_name: string;

  @ApiProperty({
    example: 5,
    description: 'Số sao đánh giá từ 1-5',
    required: false,
    default: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  rating?: number = 0;

  @ApiProperty({ example: 1000 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({
    example: 'https://image.com/job.png',
    required: false
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'Làm web nhanh trong 24h' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Mô tả ngắn gọn về công việc' })
  @IsNotEmpty()
  @IsString()
  short_description: string;

  @ApiProperty({
    example: 5,
    required: false,
    default: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  job_stars?: number = 0;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  sub_category_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  creator_id: number;
}