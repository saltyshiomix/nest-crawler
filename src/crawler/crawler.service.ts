import { Injectable } from '@nestjs/common';
import * as scrape from 'scrape-it';
import {
  CrawlerConfig,
  ScrapeOptions,
  ScrapeOptionLinks,
} from './interfaces';
import { isArrayString } from './utils';

@Injectable()
export class CrawlerService {
  public async crawl<TResult>(config: CrawlerConfig): Promise<TResult[]> {
    const urls: string[] = await this.resolveUrls(config.target);
    return this.crawlAll<TResult>(urls, config.each);
  }

  public async scrape<TResult>(url: string | object, options: ScrapeOptions): Promise<TResult> {
    const { data } = await scrape<TResult>(url, options);
    return data;
  }

  private async resolveUrls(possibleUrls: string[] | ScrapeOptionLinks): Promise<string[]> {
    if (isArrayString(possibleUrls)) {
      return possibleUrls as string[];
    }
    const { url, links } = possibleUrls as ScrapeOptionLinks;
    return this.scrape<string[]>(url, { links });
  }

  private async crawlAll<TResult>(urls: string[], options: ScrapeOptions): Promise<TResult[]> {
    const results: TResult[] = [];
    for (let i = 0; i < urls.length; i++) {
      results.push(await this.scrape<TResult>(urls[i], options));
    }
    return results;
  }
}
