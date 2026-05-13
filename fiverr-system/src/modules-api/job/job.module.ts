import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { CloudinaryModule } from '../../modules-system/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule { }
