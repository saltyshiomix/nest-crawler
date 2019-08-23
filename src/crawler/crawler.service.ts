import { Injectable } from '@nestjs/common';
import * as scrape from 'scrape-it';
import {
  CrawlerConfig,
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

@Injectable()
export class CrawlerService {
  public async crawl<TResult>(config: CrawlerConfig): Promise<TResult[]> {
    const urls: string[] = await this.resolveUrls(config.target);
    return this.crawlAll<TResult>(urls, config.each);
  }

  public async scrape<TResult>(url: string | object, options: ScrapeOptions): Promise<TResult> {
    const { data } = await scrape(url, options);
    return data;
  }

  private async resolveUrls(possibleUrls: string[] | ScrapeOptionLinks): Promise<string[]> {
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

  private async crawlAll<TResult>(urls: string[], options: ScrapeOptions): Promise<TResult[]> {
    const results: TResult[] = [];
    for (let i = 0; i < urls.length; i++) {
      results.push(await this.scrape<TResult>(urls[i], options));
    }
    return results;
  }
}
