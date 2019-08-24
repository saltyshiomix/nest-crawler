import { Injectable } from '@nestjs/common';
import {
  fetch,
  FetchResult,
  CrawlerConfig,
  ScraperConfig,
} from '@web-master/node-web-fetch';

@Injectable()
export class NestCrawlerService {
  public async fetch<T>(config: CrawlerConfig | ScraperConfig): Promise<FetchResult<T>> {
    return fetch<T>(config);
  }
}
