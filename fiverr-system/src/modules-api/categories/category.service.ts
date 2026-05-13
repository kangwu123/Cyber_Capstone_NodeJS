import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../modules-system/prisma/prisma.service';


@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }
  async create(createCategoryDto: CreateCategoryDto) {
    const result = await this.prisma.jobCategories.create({ data: createCategoryDto });
    return result;
  }

  async findAll() {
    const result = await this.prisma.jobCategories.findMany({
      include: {
        JobSubCategories: true,
      },
    });
    return result;
  }

  async searchCategory(searchKey: string) {
    const result = await this.prisma.jobCategories.findMany({
      where: {
        category_name: { contains: searchKey }
      }
    });
    return result;
  }

  async findOne(id: number) {
    const result = await this.prisma.jobCategories.findUnique({ where: { id } });
    if (!result) throw new BadRequestException('Category not found');
    return result;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.jobCategories.findUnique({ where: { id } });
    if (!category) throw new BadRequestException('Category not found');
    const result = await this.prisma.jobCategories.update({ where: { id }, data: updateCategoryDto });
    return result;
  }

  //Xóa loại cong viec va cac cong viec con
  async remove(id: number) {

    const category = await this.prisma.jobCategories.findUnique({ where: { id } });
    if (!category) throw new BadRequestException('Category not found');

    const subCategories = await this.prisma.jobSubCategories.findMany({
      where: { category_id: id },
      select: { id: true }
    });

    const subCategoryIds = subCategories.map(sub => sub.id);
    const jobs = await this.prisma.jobs.findMany({
      where: { sub_category_id: { in: subCategoryIds } },
      select: { id: true }
    });

    const jobIds = jobs.map(job => job.id);
    await this.prisma.comments.deleteMany({
      where: { job_id: { in: jobIds } }
    });

    await this.prisma.jobs.deleteMany({
      where: { sub_category_id: { in: subCategoryIds } }
    });

    await this.prisma.jobSubCategories.deleteMany({
      where: { category_id: id }
    });

    const result = await this.prisma.jobCategories.delete({
      where: { id }
    });

    return result;
  }
}
