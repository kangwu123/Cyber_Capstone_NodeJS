import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { UserRequestDto } from './dto/create-user-request.dto';
import * as bcrypt from 'bcrypt';
import { QueryUserPaginationDto } from './dto/query-user.dto';
import { buildQueryPrisma } from '../../common/helpers/query-pagination.helper';
import { CloudinaryService } from '../../modules-system/cloudinary/cloudinary.service';
import { FileUploadDto } from './dto/upload-file.dto';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) { }
  async create(body: UserRequestDto) {
    const { email, password } = body;
    const userExists = await this.prisma.users.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = await this.prisma.users.create({
      data: {
        ...body,
        skill: body.skill?.join(','),
        certification: body.certification?.join(','),
        password: hashPassword,
      }
    });
    return user;
  }

  async uploadAvatar(user: any, body: FileUploadDto, file: Express.Multer.File) {
    const { description } = body
    const userExists = await this.prisma.users.findUnique({ where: { id: user.id } });
    if (!userExists) {
      throw new BadRequestException('User not found');
    }
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file!');
    }
    const secure = await this.cloudinaryService.uploadFile(file);
    const result = await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: secure.secure_url,
      },
    });
    return result;
  }

  async findAll() {
    const result = await this.prisma.users.findMany();
    return result;
  }

  async search(searchKey: string) {
    const result = await this.prisma.users.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchKey,
            },
          },
          {
            email: {
              contains: searchKey,
            },
          },
        ],
      },
    })
    return result;
  }

  async searchPagination(query: QueryUserPaginationDto) {
    const { page, pageSize, index, filters } = buildQueryPrisma(query);
    // const whereCondition = {
    //   ...filterValue,
    //   isDeleted: false,
    // };
    const [totalItem, result] = await Promise.all([
      this.prisma.users.count({
        where: {
          OR: [
            {
              name: {
                contains: filters,
              },
            },
            {
              email: {
                contains: filters,
              },
            },
          ],
        },
      }),
      this.prisma.users.findMany({
        where: {
          OR: [
            {
              name: {
                contains: filters,
              },
            },
            {
              email: {
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

  findOne(id: number) {
    const result = this.prisma.users.findUnique({ where: { id } });
    if (!result) throw new BadRequestException('User not found');
    return result;
  }

  async update(id: number, body: UserRequestDto) {
    const { email, password } = body;
    const userExists = await this.prisma.users.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = await this.prisma.users.update({
      where: { id },
      data: {
        ...body,
        skill: body.skill?.join(','),
        certification: body.certification?.join(','),
        password: hashPassword,
      }
    });
    return user;
  }

  async remove(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');
    const result = await this.prisma.users.update({ where: { id }, data: { isDeleted: true } });
    return result;
  }
}
