import path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsResolver } from './graphql/resolver/products.resolver';
import { ApolloDriver } from '@nestjs/apollo';
import { ProductsService } from './services/products.service';
import { PurchasesResolver } from './graphql/resolver/purchase.resolver';
import { PurchasesService } from './services/purchases.service';
import { CustomerService } from './services/customers.service';
import { CustomerResolver } from './graphql/resolver/customers.resolver';

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
    // Products
    ProductsResolver,
    ProductsService,
    // Purcheses
    PurchasesResolver,
    PurchasesService,
    // Customer
    CustomerResolver,
    CustomerService,
  ],
})
export class HttpModule {}
