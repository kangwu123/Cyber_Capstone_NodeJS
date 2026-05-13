import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class FileUploadSubCategoryDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  job_sub_category_id: number

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}