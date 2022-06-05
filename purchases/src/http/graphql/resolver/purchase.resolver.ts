import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CustomerService } from 'src/http/services/customers.service';
import { ProductsService } from 'src/http/services/products.service';
import { PurchasesService } from 'src/http/services/purchases.service';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private service: PurchasesService,
    private productService: ProductsService,
    private customerService: CustomerService,
  ) {}

  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  purchases() {
    return this.service.getAllPurchases();
  }

  @ResolveField('product', (returns) => Product)
  getProduct(@Parent() purchase: Purchase) {
    return this.productService.getProductById(purchase.productId);
  }

  @ResolveField('customer', (returns) => Customer)
  getCustomer(@Parent() purchase: Purchase) {
    return this.customerService.getCustomerById(purchase.customerId);
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    let customer;
    customer = await this.customerService.getCustomerByAuthUserId(user.sub);

    if (!customer) {
      customer = await this.customerService.createCustomer({
        authUserId: user.sub,
      });
    }

    return this.service.createPurchase({
      customerId: customer.id,
      productId: data.productId,
    });
  }
}
