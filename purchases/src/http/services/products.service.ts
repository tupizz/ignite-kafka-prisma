import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateProductPayload {
  title: string;
  slug: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  getAllProducts() {
    return this.prisma.product.findMany();
  }

  async createProduct(data: CreateProductPayload) {
    const productWithSameSlug = await this.prisma.product.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (productWithSameSlug) {
      throw new Error('slug already exists');
    }

    return this.prisma.product.create({
      data,
    });
  }
}
