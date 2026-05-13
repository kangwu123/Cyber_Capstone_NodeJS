import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
    @ApiProperty({ example: 1, description: 'ID của công việc' })
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    job_id: number;

    @ApiProperty({ example: 1, description: 'ID của người thuê' })
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    hirer_id: number;

    @ApiProperty({ example: true, description: 'Trạng Thái Hoàn Thành' })
    @IsBoolean()
    @IsNotEmpty()
    is_completed: boolean;
}
