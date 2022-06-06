import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateCoursePayload {
  title: string;
  slug: string;
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  listAllCourses() {
    return this.prisma.course.findMany();
  }

  async createCourse(payload: CreateCoursePayload) {
    const courseAlreadyExists = await this.prisma.course.findUnique({
      where: {
        slug: payload.slug,
      },
    });

    if (courseAlreadyExists) {
      throw new Error('course already exists');
    }

    return this.prisma.course.create({
      data: payload,
    });
  }

  findBySlug(slug: string) {
    return this.prisma.course.findUnique({
      where: {
        slug,
      },
    });
  }

  findCourseById(id: string) {
    return this.prisma.course.findUnique({
      where: {
        id,
      },
    });
  }
}
