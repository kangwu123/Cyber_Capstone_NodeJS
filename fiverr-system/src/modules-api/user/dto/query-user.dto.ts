import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class QueryUserPaginationDto {
  // @ApiPropertyOptional({ example: '{"name": "", "phone": "", "email: ""}' })
  @ApiPropertyOptional({ example: 'Enter name or email' })
  @IsOptional()
  @IsString()
  filters: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  page: string;

  @ApiPropertyOptional({ example: '3' })
  @IsOptional()
  @IsString()
  pageSize: string;
}