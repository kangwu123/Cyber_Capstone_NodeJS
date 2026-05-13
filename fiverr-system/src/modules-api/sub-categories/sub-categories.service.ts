import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { FileUploadSubCategoryDto } from './dto/upload-file.dto';
import { CloudinaryService } from '../../modules-system/cloudinary/cloudinary.service';

@Injectable()
export class JobSubCategoriesService {
  constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) { }

  async create(data: CreateSubCategoryDto) {
    const { category_id } = data
    const category = await this.prisma.jobCategories.findUnique({ where: { id: category_id } });
    if (!category) throw new BadRequestException('Category not found');
    return await this.prisma.jobSubCategories.create({ data });
  }

  async findAll() {
    return await this.prisma.jobSubCategories.findMany();
  }

  async searchAll(searchKey: string = '') {
    return await this.prisma.jobSubCategories.findMany({
      where: {
        sub_category_name: { contains: searchKey }
      }
    });
  }
  async uploadImage(body: FileUploadSubCategoryDto, file: Express.Multer.File) {
    const { job_sub_category_id } = body
    console.log("job_sub_category_id", job_sub_category_id);
    if (!file) {
      throw new BadRequestException('Please choose file!');
    }
    const secure = await this.cloudinaryService.uploadFile(file);
    const result = await this.prisma.jobSubCategories.update({
      where: {
        id: job_sub_category_id,
      },
      data: {
        image: secure.secure_url,
      },
    })
    return result;
  }

  async findOne(id: number) {
    return await this.prisma.jobSubCategories.findUnique({
      where: { id }
    });
  }

  async remove(id: number) {
    return await this.prisma.jobSubCategories.delete({ where: { id } });
  }
}
