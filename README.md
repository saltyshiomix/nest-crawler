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
$ npm install --save nest-crawler
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

  // scrape the specific page
  public async scrape(): Promise<void> {
    interface ExampleCom {
      title: string;
      info: string;
    }

    const data = await this.crawler.scrape('http://example.com', {
      title: 'h1',
      info: {
        selector: 'p > a',
        attr: 'href',
      },
    });

    console.log(data);
    // {
    //   title: 'Example Domain',
    //   info: 'http://www.iana.org/domains/example'
    // }
  }

  // crawl the pages according to the config
  public async crawl(): Promise<void> {
    interface HackerNewsPage {
      title: string;
    }

    const pages: HackerNewsPage[] = await this.crawler.crawl({
      target: {
        url: 'https://news.ycombinator.com',
        iterator: {
          selector: 'span.age > a',
          convert: (path) => `https://news.ycombinator.com/${path}`,
        },
      },
      each: {
        title: '.title',
      },
    });

    console.log(pages);
    // [
    //   { title: 'An easiest scraping and crawling module for NestJS' },
    //   { title: 'A minimalistic boilerplate on top of Webpack, Babel, TypeScript and React' },
    //   ...
    //   ...
    //   { title: '[Experimental] React SSR as a view template engine' }
    // ]
  }
}
```
