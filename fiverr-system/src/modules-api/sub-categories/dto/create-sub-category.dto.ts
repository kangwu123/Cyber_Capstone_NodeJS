import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @ApiProperty({ example: 'Web Design', description: 'Tên phân loại con' })
  @IsString()
  @IsNotEmpty()
  sub_category_name: string;

  @ApiPropertyOptional({ example: 'https://link-to-image.com/web.jpg' })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ example: 1, description: 'ID của loại công việc cha' })
  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}
