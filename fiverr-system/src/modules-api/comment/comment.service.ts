import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../../modules-system/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) { }
  async create(body: CreateCommentDto) {
    const { job_id, user_id } = body;
    const job = await this.prisma.jobs.findUnique({ where: { id: job_id } });
    if (!job) throw new BadRequestException('Job not found');

    const user = await this.prisma.users.findUnique({ where: { id: user_id } });
    if (!user) throw new BadRequestException('User not found');

    const result = await this.prisma.comments.create({
      data: body
    });
    return result;
  }

  async findAll(job_id?: number) {
    const result = await this.prisma.comments.findMany({
      where: job_id ? { job_id: job_id } : {},
      orderBy: { create_date: 'desc' },
    });
    return result;
  }

  async findOne(id: number) {
    const result = await this.prisma.comments.findUnique({ where: { id } });
    if (!result) throw new BadRequestException('Comment not found');
    return result;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = this.prisma.comments.findUnique({ where: { id } });
    if (!comment) throw new BadRequestException('Comment not found');
    const result = this.prisma.comments.update({ where: { id }, data: updateCommentDto });
    return result;
  }

  remove(id: number) {
    const comment = this.prisma.comments.findUnique({ where: { id } });
    if (!comment) throw new BadRequestException('Comment not found');
    const result = this.prisma.comments.delete({ where: { id } });
    return result;
  }
}
