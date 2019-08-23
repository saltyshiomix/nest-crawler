<p align="center">
  <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo">
</p>
<p align="center">😎 nest-crawler 😎</p>
<p align="center">Crawler and Scraper for NestJS</p>
<p align="center">
  <img src="https://img.shields.io/npm/v/nest-crawler.svg" alt="NPM Version">
  <img src="https://img.shields.io/npm/l/nest-crawler.svg" alt="Package License (MIT)">
  <img src="https://img.shields.io/npm/dm/nest-crawler.svg" alt="NPM Downloads">
</p>

## Installation

```bash
# install it
$ npm install --save nest-crawler

# install @types/cheerio as dev dependencies
$ npm install --save-dev @types/cheerio
```

## Usage

First, register it in the application module so that Nest can handle dependencies:

```ts
import { Module } from '@nestjs/common';
import { CrawlerModule } from 'nest-crawler';

@Module({
  imports: [
    CrawlerModule,
  ],
})
export class AppModule {}
```

Then, just import it and use it:

**my-crawler.module.ts**

```ts
import { Module } from '@nestjs/common';
import { CrawlerModule } from 'nest-crawler';
@Module({
  imports: [
    CrawlerModule,
  ],
})
export class MyCrawlerModule {}
```

**my-crawler.service.ts**

```ts
import { Injectable } from '@nestjs/common';
import { CrawlerService } from 'nest-crawler';

@Injectable()
export class MyCrawlerService {
  constructor(
    private readonly crawler: CrawlerService,
  ) {}

  // scraping the specific page
  public async scrape(): Promise<void> {
    interface ExampleCom {
      title: string;
      info: string;
    }

    const data: ExampleCom = await this.crawler.fetch({
      target: 'http://example.com',
      fetch: {
        title: 'h1',
        info: {
          selector: 'p > a',
          attr: 'href',
        },
      },
    });

    console.log(data);
    // {
    //   title: 'Example Domain',
    //   info: 'http://www.iana.org/domains/example'
    // }
  }

  // crawling multi pages is also supported
  public async crawl(): Promise<void> {
    interface HackerNewsPage {
      title: string;
    }

    const pages: HackerNewsPage[] = await this.crawler.fetch({
      target: {
        url: 'https://news.ycombinator.com',
        iterator: {
          selector: 'span.age > a',
          convert: (path) => `https://news.ycombinator.com/${path}`,
        },
      },
      fetch: {
        title: '.title',
      },
    });

    console.log(pages);
    // [
    //   { title: 'An easiest crawling and scraping module for NestJS' },
    //   { title: 'A minimalistic boilerplate on top of Webpack, Babel, TypeScript and React' },
    //   ...
    //   ...
    //   { title: '[Experimental] React SSR as a view template engine' }
    // ]
  }
}
```
