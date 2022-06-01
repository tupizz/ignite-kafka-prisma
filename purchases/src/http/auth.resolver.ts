import { UseGuards } from '@nestjs/common';
import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AuthorizationGuard } from './auth/authorization.guard';

@ObjectType()
class GetUserQuery {
  @Field()
  id: string;
}

@Resolver()
export class AuthResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => GetUserQuery)
  @UseGuards(AuthorizationGuard)
  getUser() {
    return this.prisma.customer.findFirst();
  }
}
