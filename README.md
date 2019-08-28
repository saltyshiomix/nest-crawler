<p align="center">
  <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo">
</p>
<p align="center">😎 nest-crawler 😎</p>
<p align="center">Crawler and Scraper Module for NestJS</p>
<p align="center">
  <a href="https://npm.im/nest-crawler" alt="A version of nest-crawler">
    <img src="https://img.shields.io/npm/v/nest-crawler.svg">
  </a>
  <a href="https://npm.im/nest-crawler" alt="Downloads of nest-crawler">
    <img src="https://img.shields.io/npm/dt/nest-crawler.svg">
  </a>
  <img src="https://img.shields.io/npm/l/nest-crawler.svg" alt="Package License (MIT)">
</p>

## Installation

```bash
$ npm install --save nest-crawler
```

## Usage

First, register it in the application module so that Nest can handle dependencies:

```ts
import { Module } from '@nestjs/common';
import { NestCrawlerModule } from 'nest-crawler';

@Module({
  imports: [
    NestCrawlerModule,
  ],
})
export class AppModule {}
```

Then, just import it and use it:

**crawler.module.ts**

```ts
import { Module } from '@nestjs/common';
import { NestCrawlerModule } from 'nest-crawler';
@Module({
  imports: [
    NestCrawlerModule,
  ],
})
export class CrawlerModule {}
```

**crawler.service.ts**

```ts
import { Injectable } from '@nestjs/common';
import { NestCrawlerService } from 'nest-crawler';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly crawler: NestCrawlerService,
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
      fetch: (data, index, url) => ({
        title: '[class="title"] > a',
      }),
    });

    console.log(pages);
    // [
    //   { title: 'Post Title 1' },
    //   { title: 'Post Title 2' },
    //   ...
    //   ...
    //   { title: 'Post Title 30' }
    // ]
  }
}
```

## Recipe

### Single Page Scraping

```ts
import { Injectable } from '@nestjs/common';
import { NestCrawlerService } from 'nest-crawler';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly crawler: NestCrawlerService,
  ) {}

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
}
```

### Multi Pages Crawling

#### You Know the target urls already

```ts
import { Injectable } from '@nestjs/common';
import { NestCrawlerService } from 'nest-crawler';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly crawler: NestCrawlerService,
  ) {}

  public async crawl(): Promise<void> {
    interface TitleHolder {
      title: string;
    }

    const data: TitleHolder[] = await this.crawler.fetch({
      target: [
        'https://example1.com',
        'https://example2.com',
        'https://example3.com',
      ],
      fetch: () => ({
        title: 'h1',
      }),
    });

    console.log(data);
    // [
    //   { title: 'An easiest crawling and scraping module for NestJS' },
    //   { title: 'A minimalistic boilerplate on top of Webpack, Babel, TypeScript and React' },
    //   { title: '[Experimental] React SSR as a view template engine' }
    // ]
  }
}
```

#### You Don't Know the Target Urls so Want to Crawl Dynamically

```ts
import { Injectable } from '@nestjs/common';
import { NestCrawlerService } from 'nest-crawler';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly crawler: NestCrawlerService,
  ) {}

  public async crawl(): Promise<void> {
    interface TitleHolder {
      title: string;
    }

    const data: TitleHolder[] = await this.crawler.fetch({
      target: {
        url: 'https://news.ycombinator.com',
        iterator: {
          selector: 'span.age > a',
          convert: (x: string) => `https://news.ycombinator.com/${x}`,
        },
      },
      // fetch each `https://news.ycombinator.com/${x}` and scrape data
      fetch: (data: any, index: number, url: string) => ({
        title: '[class="title"] > a',
      }),
    });

    console.log(data);
    // [
    //   { title: 'Post Title 1' },
    //   { title: 'Post Title 2' },
    //   ...
    //   ...
    //   { title: 'Post Title 30' }
    // ]
  }
}
```

#### You Need to Pass Data Dynamically

```ts
import { Injectable } from '@nestjs/common';
import { NestCrawlerService } from 'nest-crawler';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly crawler: NestCrawlerService,
  ) {}

  public async crawl(): Promise<void> {
    interface ImageHolder {
      src: string;
    }

    const data: ImageHolder[] = await this.crawler.fetch({
      target: {
        url: 'https://some.image.com',
        iterator: {
          selector: 'span.age > a',
          convert: (x: string) => `https://some.image.com${x}`,
        },
        fetch: {
          imageIds: {
            listItem: '.central-featured-lang',
            data: {
              id: {
                selector: 'div.image-id',
                attr: 'data-image-id',
              },
            },
          },
        },
      },
      // fetch each `https://some.image.com${x}`, pass data and scrape data
      fetch: ({ imageIds }, index, url) => ({
        src: {
          convert: () => `https://some.image.com/images/${imageIds[index]}.png`,
        },
      }),
    });

    console.log(data);
    // [
    //   { src: 'https://some.image.com/images/1.png' },
    //   { src: 'https://some.image.com/images/2.png' },
    //   ...
    //   ...
    //   { src: 'https://some.image.com/images/100.png' }
    // ]
  }
}
```

#### Waitable (by using `puppeteer`)

```ts
import { Injectable } from '@nestjs/common';
import { NestCrawlerService } from 'nest-crawler';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly crawler: NestCrawlerService,
  ) {}

  public async crawl(): Promise<void> {
    interface TitleHolder {
      title: string;
    }

    const data: TitleHolder[] = await this.crawler.fetch({
      target: {
        url: 'https://news.ycombinator.com',
        iterator: {
          selector: 'span.age > a',
          convert: (x: string) => `https://news.ycombinator.com/${x}`,
        },
      },
      waitFor: 3 * 1000, // wait for the content loaded! (like single page apps)
      fetch: (data: any, index: number, url: string) => ({
        title: '[class="title"] > a',
      }),
    });

    console.log(data);
    // [
    //   { title: 'Post Title 1' },
    //   { title: 'Post Title 2' },
    //   ...
    //   ...
    //   { title: 'Post Title 30' }
    // ]
  }
}
```

## Related

- [@web-master/node-web-fetch](https://github.com/saltyshiomix/web-master/blob/master/packages/node-web-fetch)
