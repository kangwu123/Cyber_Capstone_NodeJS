import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  job_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 'Làm web nhanh trong 24h' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 5, description: 'Số sao đánh giá từ 1-5' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  rating_stars: number;
}
