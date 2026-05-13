import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobPaginationDto } from './dto/search-job.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadJobDto } from './dto/upload-file.dto';


@Controller('job')
@ApiTags('Jobs')
@ApiBearerAuth('JWT-auth')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Post()
  @ApiOperation({ summary: 'Create new job' })
  @ApiResponse({ status: 200, description: 'Create new job success' })
  @Public()
  create(@Body() body: CreateJobDto) {
    return this.jobService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'Get all jobs success' })
  @Public()
  findAll() {
    return this.jobService.findAll();
  }

  @Get('searchPagination')
  @ApiOperation({ summary: 'Search jobs with pagination by query job name or job description' })
  @ApiResponse({ status: 200, description: 'Search jobs success' })
  @Public()
  searchPagination(@Query() query: QueryJobPaginationDto) {
    return this.jobService.searchPagination(query);
  }

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Public()
  async uploadImage(@Body() body: FileUploadJobDto, @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 2097152 }), // Kiểm tra cho phép tối đa 2mb/ kiểm tra empty
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), // Giới hạn các file được nhận
    ],
  })) file: Express.Multer.File) {
    const result = await this.jobService.uploadImage(body, file);
    return result;
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(+id);
  }
}
