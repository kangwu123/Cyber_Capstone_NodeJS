import { Module } from '@nestjs/common';
import { BookingService } from './booking.services';
import { BookingController } from './booking.controller';

@Module({
    controllers: [BookingController],
    providers: [BookingService],
})
export class BookingModule {}
