import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { buildQueryPrisma } from '../../common/helpers/query-pagination.helper';
import { QueryJobPaginationDto } from './dto/search-job.dto';
import { FileUploadJobDto } from './dto/upload-file.dto';
import { CloudinaryService } from '../../modules-system/cloudinary/cloudinary.service';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) { }

  async create(body: CreateJobDto) {
    const { sub_category_id } = body
    const subCategory = await this.prisma.jobSubCategories.findUnique({ where: { id: sub_category_id } });
    if (!subCategory) throw new BadRequestException('Sub category not found');
    return await this.prisma.jobs.create({
      data: body,
    });
  }


  async findAll() {
    const result = await this.prisma.jobs.findMany();
    return result;
  }


  async uploadImage(body: FileUploadJobDto, file: Express.Multer.File) {
    const { job_id } = body
    if (!file) {
      throw new BadRequestException('Please choose file!');
    }
    const secure = await this.cloudinaryService.uploadFile(file);
    const result = await this.prisma.jobs.update({
      where: {
        id: job_id,
      },
      data: {
        image: secure.secure_url,
      },
    })
    return result;
  }

  async searchPagination(query: QueryJobPaginationDto) {
    const { page, pageSize, index, filters } = buildQueryPrisma(query);
    const [totalItem, result] = await Promise.all([
      this.prisma.jobs.count({
        where: {
          OR: [
            {
              job_name: {
                contains: filters,
              },
            },
            {
              description: {
                contains: filters,
              },
            },
          ],
        },
      }),
      this.prisma.jobs.findMany({
        where: {
          OR: [
            {
              job_name: {
                contains: filters,
              },
            },
            {
              description: {
                contains: filters,
              },
            },
          ],
        },
        skip: index,
        take: pageSize,
      }),
    ]);
    return {
      page,
      pageSize,
      totalPage: Math.ceil(totalItem / pageSize),
      totalItem: totalItem,
      items: result,
    };
  }

  async findOne(id: number) {
    const job = await this.prisma.jobs.findUnique({ where: { id } });
    if (!job) throw new BadRequestException(`Job not found`);
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const { sub_category_id } = updateJobDto

    const existingJob = await this.prisma.jobs.findUnique({ where: { id } });
    if (!existingJob) throw new BadRequestException(`Job not found`);

    const subCategory = await this.prisma.jobSubCategories.findUnique({ where: { id: sub_category_id } });
    if (!subCategory) throw new BadRequestException('Sub category not found');

    return await this.prisma.jobs.update({
      where: { id },
      data: updateJobDto,
    });
  }

  async remove(id: number) {
    const existingJob = await this.prisma.jobs.findUnique({ where: { id } });
    if (!existingJob) throw new BadRequestException(`Job not found`);

    await this.prisma.comments.deleteMany({
      where: { job_id: id }
    });
    await this.prisma.hiredJobs.deleteMany({
      where: { job_id: id }
    });
    return await this.prisma.jobs.delete({
      where: { id }
    });
  }
}
