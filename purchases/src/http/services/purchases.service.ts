import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreatePurchasePayload {
  productId: string;
  customerId: string;
}

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.purchase.create({
      data: {
        ...payload,
      },
    });
  }
}
