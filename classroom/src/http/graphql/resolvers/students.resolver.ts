import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { EnrollmentService } from 'src/http/services/enrollments.service';
import { StudentsService } from 'src/http/services/students.service';
import { Enrollment } from '../models/enrollment';
import { Student } from '../models/student';

@Resolver(() => Student)
export class StudentResolver {
  constructor(
    private service: StudentsService,
    private enrollmentService: EnrollmentService,
  ) {}

  @Query(() => Student)
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.service.getStudentByAuthUserId(user.sub);
  }

  @ResolveField('enrollments', (returns) => [Enrollment])
  enrollments(@Parent() student: Student) {
    return this.enrollmentService.listAllEnrollmentsByStudent(student.id);
  }

  @Query(() => [Student])
  @UseGuards(AuthorizationGuard)
  async students() {
    return this.service.listAllStudents();
  }
}
