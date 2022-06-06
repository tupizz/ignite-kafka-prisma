import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateStudentPayload {
  authUserId: string;
}
@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  listAllStudents() {
    return this.prisma.student.findMany();
  }

  getStudentByAuthUserId(authUserId: string) {
    return this.prisma.student.findUnique({
      where: {
        authUserId,
      },
    });
  }

  create(payload: CreateStudentPayload) {
    return this.prisma.student.create({
      data: payload,
    });
  }

  findStudentById(id: string) {
    return this.prisma.student.findUnique({
      where: {
        id,
      },
    });
  }
}
