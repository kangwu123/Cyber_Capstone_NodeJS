import { Module } from '@nestjs/common';
import { JobSubCategoriesController } from './sub-categories.controller';
import { JobSubCategoriesService } from './sub-categories.service';
import { CloudinaryModule } from '../../modules-system/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [JobSubCategoriesController],
  providers: [JobSubCategoriesService],
})
export class SubCategoriesModule { }
