import path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from 'src/database/database.module';
import { ApolloDriver } from '@nestjs/apollo';
import { CourseResolver } from './graphql/resolvers/courses.resolver';
import { CoursesService } from './services/courses.service';
import { StudentResolver } from './graphql/resolvers/students.resolver';
import { StudentsService } from './services/students.service';
import { EnrollmentResolver } from './graphql/resolvers/enrollments.resolver';
import { EnrollmentService } from './services/enrollments.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    CoursesService,
    CourseResolver,

    StudentsService,
    StudentResolver,

    EnrollmentService,
    EnrollmentResolver,
  ],
})
export class HttpModule {}
