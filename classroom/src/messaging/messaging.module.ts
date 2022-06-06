import { Module } from '@nestjs/common';
import { HttpModule } from 'src/http/http.module';
import { PurchaseController } from './controllers/purchase.controller';

@Module({
  controllers: [PurchaseController],
  imports: [HttpModule],
})
export class MessagingModule {}
