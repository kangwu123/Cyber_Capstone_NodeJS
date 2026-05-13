import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@Controller('comment')
@ApiTags('Comment')
@ApiBearerAuth('JWT-auth')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  create(@Body() body: CreateCommentDto) {
    return this.commentService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments or get comments by job_id' })
  @ApiQuery({ name: 'job_id', required: false })
  @Public()
  findAll(@Query('job_id') job_id: string) {
    return this.commentService.findAll(job_id ? +job_id : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
