import { Controller, Get, Post, Body, Param, Delete, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JobSubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { Public } from '../../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadSubCategoryDto } from './dto/upload-file.dto';

@ApiTags('JobSubCategories')
@Controller('job-sub-categories')
@ApiBearerAuth('JWT-auth')
export class JobSubCategoriesController {
  constructor(private readonly jobSubCategoriesService: JobSubCategoriesService) { }

  @Post()
  @ApiOperation({ summary: 'Create job sub category' })
  create(@Body() createDto: CreateSubCategoryDto) {
    return this.jobSubCategoriesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job sub categories' })
  @ApiQuery({ name: 'searchKey', required: false, description: 'Search key to find job sub categories' })
  @Public()
  findAll() {
    return this.jobSubCategoriesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Get all job sub categories' })
  @ApiQuery({ name: 'searchKey', required: false, description: 'Search key to find job sub categories' })
  @Public()
  searchAll(@Query('searchKey') searchKey?: string) {
    return this.jobSubCategoriesService.searchAll(searchKey);
  }

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Body() body: FileUploadSubCategoryDto, @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 2097152 }), // Kiểm tra cho phép tối đa 2mb/ kiểm tra empty
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), // Giới hạn các file được nhận
    ],
  })) file: Express.Multer.File) {
    const result = await this.jobSubCategoriesService.uploadImage(body, file);
    return result;
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get job sub category by id' })
  @Public()
  findOne(@Param('id') id: string) {
    return this.jobSubCategoriesService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove job sub category' })
  remove(@Param('id') id: string) {
    return this.jobSubCategoriesService.remove(+id);
  }
}
