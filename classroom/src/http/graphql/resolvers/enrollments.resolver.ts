import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { CoursesService } from 'src/http/services/courses.service';
import { EnrollmentService } from 'src/http/services/enrollments.service';
import { StudentsService } from 'src/http/services/students.service';
import { Course } from '../models/course';
import { Enrollment } from '../models/enrollment';
import { Student } from '../models/student';

@Resolver((of) => Enrollment)
export class EnrollmentResolver {
  constructor(
    private service: EnrollmentService,
    private courseService: CoursesService,
    private studentService: StudentsService,
  ) {}

  @Query(() => [Enrollment])
  @UseGuards(AuthorizationGuard)
  async enrollments() {
    return this.service.listAllEnrollments();
  }

  @ResolveField('course', (returns) => Course)
  getCourse(@Parent() enrollment: Enrollment) {
    return this.courseService.findCourseById(enrollment.courseId);
  }

  @ResolveField('student', (returns) => Student)
  getEnrollment(@Parent() enrollment: Enrollment) {
    return this.studentService.findStudentById(enrollment.studentId);
  }
}
