import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class QueryJobPaginationDto {
  // @ApiPropertyOptional({ example: '{"job_name": "", "description": "", "short_description: ""}' })
  @ApiPropertyOptional({ example: 'java', description: 'Enter job name or job description' })
  @IsOptional()
  @IsString()
  filters: string;

  @ApiPropertyOptional({ example: '1', description: 'Page number' })
  @IsOptional()
  @IsString()
  page: string;

  @ApiPropertyOptional({ example: '3', description: 'Number of items per page' })
  @IsOptional()
  @IsString()
  pageSize: string;
}