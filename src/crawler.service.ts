import { Injectable } from '@nestjs/common';
import fetch, { ScrapeConfig, CrawlConfig } from '@web-master/node-web-fetch';

@Injectable()
export class NestCrawlerService {
  public async fetch<T>(config: ScrapeConfig | CrawlConfig): Promise<T> {
    return fetch<T>(config);
  }
}
