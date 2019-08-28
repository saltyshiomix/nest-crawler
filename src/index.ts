import { ScrapeConfig, CrawlConfig } from '@web-master/node-web-fetch';
import { NestCrawlerModule } from './crawler.module';
import { NestCrawlerService } from './crawler.service';
import { normalizeNumber } from './utils';

export {
  ScrapeConfig,
  CrawlConfig,
  NestCrawlerModule,
  NestCrawlerService,
  normalizeNumber,
}
