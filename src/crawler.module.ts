import { Module } from '@nestjs/common';
import { NestCrawlerService } from './crawler.service';

@Module({
  providers: [
    NestCrawlerService,
  ],
  exports: [
    NestCrawlerService,
  ],
})
export class NestCrawlerModule {}
