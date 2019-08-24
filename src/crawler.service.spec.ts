import ava, { TestInterface } from 'ava';
import { NestCrawlerService } from './crawler.service';

const test = ava as TestInterface<{ crawler: NestCrawlerService }>;

test.beforeEach(t => {
  t.context = {
    crawler: new NestCrawlerService,
  };
});

test('it can scrape one page as a object', async t => {
  interface ExampleCom {
    title: string;
    info: string;
  }

  const { crawler } = t.context;

  const actual: ExampleCom = await crawler.fetch({
    target: 'http://example.com',
    fetch: {
      title: 'h1',
      info: {
        selector: 'p > a',
        attr: 'href',
      },
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

  const actual: Wikipadia = await crawler.fetch({
    target: 'https://www.wikipedia.org',
    fetch: {
      urls: {
        listItem: '.central-featured-lang',
        data: {
          url: {
            selector: 'a',
            attr: 'href',
          },
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

  const pages: HackerNewsPage[] = await crawler.fetch({
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

  t.is(pages.length, 30);
  t.true(pages[0].title !== '');
});
