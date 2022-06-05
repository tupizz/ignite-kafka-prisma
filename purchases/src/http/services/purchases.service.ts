import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { KafkaService } from 'src/messaging/kafka.service';

interface CreatePurchasePayload {
  productId: string;
  customerId: string;
}

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) {}

  getAllPurchases() {
    return this.prisma.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getAllPurchasesFromCustomerId(customerId: string) {
    return this.prisma.purchase.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createPurchase(payload: CreatePurchasePayload) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: payload.productId,
      },
    });

    if (!product) {
      throw new Error('no product was found for given productId');
    }

    const purchase = await this.prisma.purchase.create({
      data: {
        ...payload,
      },
    });

    console.log(purchase);

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: payload.customerId,
      },
    });

    this.kafka.emit('purchases.new-purchase', {
      customer: {
        authUserId: customer.authUserId,
      },
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });

    return purchase;
  }
}
