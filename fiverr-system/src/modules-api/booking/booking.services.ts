import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { PrismaService } from "../../modules-system/prisma/prisma.service";

@Injectable()
export class BookingService {
    constructor(private prisma: PrismaService) { }
    async create(body: CreateBookingDto) {
        const { job_id, hirer_id } = body;
        const job = await this.prisma.jobs.findUnique({ where: { id: job_id } });
        if (!job) throw new BadRequestException('Job not found');

        const hirer = await this.prisma.users.findUnique({ where: { id: hirer_id } });
        if (!hirer) throw new BadRequestException('Hirer not found');
        const result = await this.prisma.hiredJobs.create({
            data: body
        });
        return result;
    }

    async findAll(hirerId?: number) {
        return await this.prisma.hiredJobs.findMany({
            where: hirerId ? { hirer_id: hirerId } : {},
            orderBy: { create_date: 'desc' },
        });
    }

    async findAllByHirer(user: any) {
        const { id } = user;
        return await this.prisma.hiredJobs.findMany({
            where: { hirer_id: id },
            orderBy: { create_date: 'desc' },
        });
    }

    async findOne(id: number) {
        const booking = await this.prisma.hiredJobs.findUnique({ where: { id } });
        if (!booking) throw new BadRequestException('Booking not found');
        return booking;
    }

    async update(id: number, updateBookingDto: UpdateBookingDto) {
        const booking = await this.prisma.hiredJobs.findUnique({ where: { id } });
        if (!booking) throw new BadRequestException('Booking not found');
        const result = await this.prisma.hiredJobs.update({
            where: { id },
            data: updateBookingDto,
        });
        return result;
    }

    async remove(id: number) {
        const booking = await this.prisma.hiredJobs.findUnique({ where: { id } });
        if (!booking) throw new BadRequestException('Booking not found');
        const result = await this.prisma.hiredJobs.delete({ where: { id } });
        return result;
    }
}
