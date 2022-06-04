import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CustomerService } from 'src/http/services/customers.service';
import { PurchasesService } from 'src/http/services/purchases.service';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { Customer } from '../models/customer';
import { Purchase } from '../models/purchase';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private service: CustomerService,
    private purchaseService: PurchasesService,
  ) {}

  @Query(() => Customer)
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.service.getCustomerByAuthUserId(user.sub);
  }

  @ResolveField('purchases', (returns) => [Purchase])
  getPurchases(@Parent() customer: Customer) {
    return this.purchaseService.getAllPurchasesFromCustomerId(customer.id);
  }
}
