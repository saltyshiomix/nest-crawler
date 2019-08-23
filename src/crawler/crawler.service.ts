import { Injectable } from '@nestjs/common';
import * as scrape from 'scrape-it';
import {
  CrawlerConfig,
  ScraperConfig,
  ScrapeOptions,
  ScrapeOptionLinks,
} from './interfaces';
import { isArrayString } from './utils';

interface UrlObject {
  url: string;
}

interface UrlHolder {
  urls: UrlObject[];
}

type TResult<T> = T extends Array<infer R> ? R[] : T;

@Injectable()
export class CrawlerService {
  public async fetch<T>(config: CrawlerConfig | ScraperConfig): Promise<TResult<T>> {
    if (this.isCrawlerConfig(config)) {
      return this.crawl(config) as Promise<TResult<T>>;
    }
    if (this.isScraperConfig(config)) {
      const { target, fetch } = config;
      return this.scrape(target, fetch);
    }
    throw new Error('config must be one of CrawlerConfig or ScraperConfig');
  }

  private isCrawlerConfig(config: any): config is CrawlerConfig {
    return !this.isScraperConfig(config);
  }

  private isScraperConfig(config: any): config is ScraperConfig {
    return typeof config.target === 'string';
  }

  private async crawl<T>(config: CrawlerConfig): Promise<T[]> {
    const { target, fetch } = config;
    const urls: string[] = await this.resolve(target);
    return this.crawlAll<T>(urls, fetch);
  }

  private async scrape<T>(url: string | object, options: ScrapeOptions): Promise<T> {
    const { data } = await scrape(url, options);
    return data;
  }

  private async resolve(possibleUrls: string[] | ScrapeOptionLinks): Promise<string[]> {
    if (isArrayString(possibleUrls)) {
      return possibleUrls as string[];
    }

    const { url, iterator } = possibleUrls as ScrapeOptionLinks;
    let holder: UrlHolder;
    if (typeof iterator === 'string') {
      holder = await this.scrape(url, {
        urls: {
          listItem: iterator,
          data: {
            url: { attr: 'href' },
          },
        },
      });
      return this.extractUrls(holder);
    } else {
      const { selector, convert } = iterator;
      holder = await this.scrape(url, {
        urls: {
          listItem: selector,
          data: {
            url: { attr: 'href' },
          },
        },
      });
      return this.extractUrls(holder, convert);
    }
  }

  private extractUrls(holder: UrlHolder, convert?: (link: string) => string): string[] {
    const urls: string[] = [];
    for (let i = 0; i < holder.urls.length; i++) {
      let { url } = holder.urls[i];
      if (convert) {
        url = convert(url);
      }
      urls.push(url);
    }
    return urls;
  }

  private async crawlAll<T>(urls: string[], options: ScrapeOptions): Promise<T[]> {
    const results = [];
    for (let i = 0; i < urls.length; i++) {
      results.push(await this.scrape<T>(urls[i], options));
      if (i == 1) {
        break;
      }
    }
    return results;
  }
}
