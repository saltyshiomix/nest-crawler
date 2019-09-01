import {
  ScrapeConfig,
  ScrapeOptions,
  ScrapeOptionElement,
  ScrapeOptionList,
  CrawlConfig,
  CrawlLinkOptions,
} from '@web-master/node-web-fetch';
import { NestCrawlerModule } from './crawler.module';
import { NestCrawlerService } from './crawler.service';
import { normalizeNumber } from './utils';

export {
  ScrapeConfig,
  ScrapeOptions,
  ScrapeOptionElement,
  ScrapeOptionList,
  CrawlConfig,
  CrawlLinkOptions,
  NestCrawlerModule,
  NestCrawlerService,
  normalizeNumber,
}
