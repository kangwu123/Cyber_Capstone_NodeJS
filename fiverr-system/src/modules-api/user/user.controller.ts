import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, UploadedFile, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRequestDto } from './dto/create-user-request.dto';
import { UserResponseDto } from './dto/create-user-response.dto';
import { QueryUserPaginationDto } from './dto/query-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/upload-file.dto';
import { User } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/role.decorator';

@Controller('user')
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Get all users success' })
  @Public()
  findAll() {
    return this.userService.findAll();
  }

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Body() body: FileUploadDto, @User() user: any, @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 2097152 }), // Kiểm tra cho phép tối đa 2mb/ kiểm tra empty
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), // Giới hạn các file được nhận
    ],
  })) file: Express.Multer.File): Promise<UserResponseDto> {
    const result = await this.userService.uploadAvatar(user, body, file);
    return new UserResponseDto(result as UserResponseDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, description: 'Create user success' })
  async create(@Body() body: UserRequestDto): Promise<UserResponseDto> {
    const result = await this.userService.create(body);
    return new UserResponseDto(result as UserResponseDto);
  }

  @Get('search/:searchKey')
  @ApiOperation({ summary: 'Search all users by name or email' })
  @ApiResponse({ status: 200, description: 'Get all users success' })
  @Public()
  search(
    @Param('searchKey') searchKey?: string
  ) {
    return this.userService.search(searchKey || '');
  }

  @Get('searchPagination')
  @ApiOperation({ summary: 'Search pagination all users' })
  @ApiResponse({ status: 200, description: 'Get all users success' })
  @Public()
  searchPagination(
    @Query() query: QueryUserPaginationDto
  ) {
    return this.userService.searchPagination(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one user using id' })
  @ApiResponse({ status: 200, description: 'Find one user using id success' })
  @Public()
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const result = await this.userService.findOne(+id);
    return new UserResponseDto(result as UserResponseDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user using id' })
  @ApiResponse({ status: 200, description: 'Update user using id success' })
  async update(@Param('id') id: string, @Body() body: UserRequestDto): Promise<UserResponseDto> {
    const result = await this.userService.update(+id, body);
    return new UserResponseDto(result as UserResponseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user using id' })
  @ApiResponse({ status: 200, description: 'Remove user using id success' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
