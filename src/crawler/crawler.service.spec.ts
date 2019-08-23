import ava, { TestInterface } from 'ava';
import { CrawlerService } from './crawler.service';
import { CrawlerConfig } from './interfaces';

const test = ava as TestInterface<{ crawler: CrawlerService }>;

test.beforeEach(t => {
  t.context = {
    crawler: new CrawlerService,
  };
});

test('it can scrape one page as a object', async t => {
  interface ExampleCom {
    title: string;
    info: string;
  }

  const { crawler } = t.context;

  const actual: ExampleCom = await crawler.scrape('http://example.com', {
    title: 'h1',
    info: {
      selector: 'p > a',
      attr: 'href',
    },
  });

  t.is(actual.title, 'Example Domain');
  t.is(actual.info, 'http://www.iana.org/domains/example');
});

test('it can scrape one page as a list object', async t => {
  interface Wikipadia {
    urls: string[];
  }

  const { crawler } = t.context;

  const actual: Wikipadia = await crawler.scrape('https://www.wikipedia.org', {
    urls: {
      listItem: '.central-featured-lang',
      data: {
        url: {
          selector: 'a',
          attr: 'href',
        },
      },
    },
  });

  t.is(actual.urls.length, 10);
});

test('it can crawl multi pages', async t => {
  interface HackerNewsPage {
    title: string;
  }

  const { crawler } = t.context;

  const config: CrawlerConfig = {
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
  };

  const pages: HackerNewsPage[] = await crawler.crawl(config);

  t.is(pages.length, 30);
  t.true(pages[0].title !== '');
});
