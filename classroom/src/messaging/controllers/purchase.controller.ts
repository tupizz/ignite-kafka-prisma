import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CoursesService } from 'src/http/services/courses.service';
import { EnrollmentService } from 'src/http/services/enrollments.service';
import { StudentsService } from 'src/http/services/students.service';

interface PurchaseCreatedPayload {
  customer: {
    authUserId: string;
  };
  product: {
    id: string;
    title: string;
    slug: string;
  };
}

@Controller()
export class PurchaseController {
  constructor(
    private studentService: StudentsService,
    private courseService: CoursesService,
    private enrollmentService: EnrollmentService,
  ) {}

  @EventPattern('purchases.new-purchase')
  async purchaseCreated(@Payload('value') payload: PurchaseCreatedPayload) {
    console.log(payload);
    let student = await this.studentService.getStudentByAuthUserId(
      payload.customer.authUserId,
    );

    if (!student) {
      student = await this.studentService.create({
        authUserId: payload.customer.authUserId,
      });
    }

    let course = await this.courseService.findBySlug(payload.product.slug);
    if (!course) {
      course = await this.courseService.createCourse({
        slug: payload.product.slug,
        title: payload.product.title,
      });
    }

    await this.enrollmentService.create({
      courseId: course.id,
      studentId: student.id,
    });
  }
}
