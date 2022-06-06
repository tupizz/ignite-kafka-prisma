import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface GetByCourseAndStudentIdParams {
  courseId: string;
  studentId: string;
}

interface CreateEnrollmentPayload {
  courseId: string;
  studentId: string;
}

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  getByCourseAndStudentId({
    courseId,
    studentId,
  }: GetByCourseAndStudentIdParams) {
    return this.prisma.enrollment.findFirst({
      where: {
        courseId,
        studentId,
        canceledAt: null,
      },
    });
  }

  create({ courseId, studentId }: CreateEnrollmentPayload) {
    return this.prisma.enrollment.create({
      data: {
        courseId,
        studentId,
      },
    });
  }

  async listAllEnrollments() {
    return this.prisma.enrollment.findMany({
      where: {
        canceledAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async listAllEnrollmentsByStudent(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: {
        studentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
